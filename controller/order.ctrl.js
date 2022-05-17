import { v4 } from 'uuid'

import Order from '../model/Order.model.js'
import { fetchService } from '../controller/service.ctrl.js'
import { createPaymentRequest } from '../controller/payment.ctrl.js'
import { fetchUser } from '../controller/account.ctrl.js'
import { locationStrToArr } from '../utils/location.utils.js'
import { isDateValid } from '../utils/date.utils.js'
import debug from '../utils/logger.js'

export const listOrders = (query = {}, options) => {
  return Order.find(query, options).lean()
}

export const fetchOrder = (query = {}, options) => {
  return Order.findOne(query, options).lean()
}

export const listOrdersMerchant = (req, res, next) => {
  return listOrders({ provider_id: req.user.id })
}

/** Validates and formats times correctly */
export const validateOrderBookingDates = (timeframe, time) => {
  const MINUTES_BETWEEN_DATES = 30 * 60 * 1000
  const now = new Date().getTime()

  if (timeframe == 'one_date_time') {
    time.date_time = new Date(parseInt(time.date_time)).getTime()
    if (
      !isDateValid(time.date_time) ||
      time.date_time - MINUTES_BETWEEN_DATES < now // should be at least 30 minutes from now
    ) {
      throw { error: 'start time is not valid', status: 400 }
    }
    return time
  }

  if (timeframe == 'multi_date_time') {
    time.dates = time.dates
      .map((a) => {
        const formatted = parseInt(a).getTime()
        if (!isDateValid(formatted)) {
          throw { error: 'one of the dates is not valid', status: 400 }
        }
        return formatted
      }) // convert to ctime
      .sort((a, b) => a - b) // sort times ascending

    // makes sure the gap between dates makes sense
    if (time.dates.length > 1) {
      for (let i = 1; i < time.dates.length - 1; i++) {
        if (time.dates[i - 1] + MINUTES_BETWEEN_DATES > time.dates[i]) {
          throw {
            error: 'the gap between times has to be at least 30 minutes',
            status: 400,
          }
        }
      }
    }
    return time
  }
  if (timeframe == 'one_start_end_date_time') {
    time.start = new Date(parseInt(time.start)).getTime()
    time.end = new Date(parseInt(time.end)).getTime()

    if (!isDateValid(time.start) || time.start - MINUTES_BETWEEN_DATES < now) {
      throw { error: 'start time is not valid', status: 400 }
    }

    if (
      !isDateValid(time.end) ||
      time.end < now ||
      time.start + MINUTES_BETWEEN_DATES > time.end // gap between start and endtime has to be at least 30 minutes
    ) {
      throw { error: 'end time is not valid', status: 400 }
    }
    return time
  }
  throw { error: 'invalid timeframe in service category', status: 400 }
}

export const createOrder = async (data, customer_id) => {
  data.customer = await fetchUser({ _id: customer_id })
  data.delivery_address = locationStrToArr(data.delivery_address)

  const serviceData = await fetchService(
    { _id: data.service_id },
    { 'photos.data': 0 },
  )
    .populate('category', 'platform_fee platform_fee_type timeframe')
    .populate('store_id', 'location')

  if (!serviceData) throw { error: 'could not find service', status: 400 }
  if (serviceData.user_id == customer_id)
    throw { error: 'can not order from your own service', status: 400 }
  if (!serviceData.category || !serviceData.category?._id)
    throw { error: 'could not find category', status: 400 }
  if (!serviceData.store_id || !serviceData.store_id?._id)
    throw { error: 'could not find store', status: 400 }

  data.time = validateOrderBookingDates(
    serviceData.category.timeframe,
    data.time,
  )

  const orderId = generateUniqueOrderId()

  const transportCost = await calculateTransportCost(
    serviceData.price_per_km,
    serviceData.store_id.location,
    data.delivery_address,
  )

  const productsCost = await calculateProductsCost(data.products)
  const addonsCost = await calculateProductsCost(data.product_addons)
  const totalCost = await calculateTotalCost(
    productsCost,
    addonsCost,
    transportCost,
    serviceData.category.platform_fee,
    serviceData.category.platform_fee_type,
  )

  const payment = await createPaymentRequest(totalCost.total, orderId, data)

  const orderData = new Order({
    order_id: orderId,
    provider_id: serviceData.user_id,
    customer_id: customer_id,
    service_id: data.service_id,
    payment: {
      status: 'pending',
      payment_id: payment.transaction_id,
    },
    status: 'pending',
    platform_fee: serviceData.category.platform_fee,
    platform_fee_type: serviceData.category.platform_fee_type,
    platform_cost: totalCost.platform_cost,
    transport_cost: transportCost,
    products_cost: productsCost,
    addons_cost: addonsCost,
    total_cost: totalCost.total,
    booking_period: data.time,
    delivery_address: data.delivery_address,
    notes: data.notes,
    products: data.products,
    product_addons: data.product_addons,
  })
  // console.log(orderData)

  return orderData.save()
}

export const generateUniqueOrderId = () => {
  return v4()
}

export const calculateTransportCost = async (
  pricePerKm,
  address,
  destination,
) => {
  pricePerKm = parseInt(pricePerKm)
  if (isNaN(pricePerKm)) throw { error: 'Invalid price per km', status: 400 }

  // Todo: Should try to get a measurement from address to destination using long lat
  // https://developers.google.com/maps/documentation/distance-matrix
  // https://developers.google.com/maps/documentation/directions/
  //
  // Todo: rate Limiting to prevent attack on spending the funds of the Google API
  // https://www.digitalocean.com/community/tutorials/how-to-build-a-rate-limiter-with-node-js-on-app-platform
  return Promise.resolve(pricePerKm * 10)
}

export const calculateProductsCost = async (products) => {
  let cost = 0
  products.forEach((product) => {
    cost += parseInt(product.price) * parseInt(product.amount)
  })
  if (isNaN(cost))
    throw { error: 'invalid product or product amount', status: 400 }

  return cost
}

export const calculateTotalCost = async (
  productsCost,
  addonsCost,
  transportCost,
  platformFee,
  platformFeeType,
) => {
  const total =
    parseInt(productsCost) + parseInt(addonsCost) + parseInt(transportCost)
  if (isNaN(total)) {
    debug.info(productsCost, addonsCost, transportCost)
    throw { error: 'invalid total_cost', status: 400 }
  }

  let platformCost = platformFee
  if (platformFeeType === 'percent') {
    if (platformFee > 10)
      throw { error: 'platform fee can not be bigger than 10%', status: 400 }
    platformCost = Math.ceil(total * (platformFee / 100))
    return { total: total + platformCost, platform_cost: platformCost }
  }
  if (platformFee > 100000)
    throw { error: 'platform fee can not be bigger than 100.000', status: 400 }

  return { total: total + platformFee, platform_cost: platformCost }
}

export const updateOrderStatus = async (data) => {
  const query = { order_id: data.order_id }
  let order = await fetchOrder(query)
  if (!order) {
    throw { error: 'could not find order from notification data', status: 400 }
  }

  if (data.fraud_status != 'accept' || data.transaction_status == 'deny') {
    // Todo: Fraud status used only in credit card???
    // potentially would require to send midtrans a cancel request because
    // credit card might be in challenge status
    let reason = 'Fraud status detected'
    if (data.transaction_status == 'deny') {
      reason = data.status_message
    }
    return await Order.updateOne(
      query,
      { 'payment.status': 'failed', status_reason: reason },
      { new: true },
    )
  }
  if (order.status == 'pending' && data.transaction_status == 'settlement') {
    const order = await Order.updateOne(
      query,
      { 'payment.status': 'paid', status: 'paid' },
      { new: true },
    )

    // send notification to Service Provider to request to accept
    // send notification to User saying payment received
    return Promise.resolve(order)
  }
  if (data.transaction_status == 'cancel') {
    const order = await Order.updateOne(
      query,
      { 'payment.status': 'canceled' },
      { new: true },
    )
    // send notification that payment got canceled and that the user
    // can choose a different payment method
    return Promise.resolve(order)
  }
  if (data.transaction_status == 'expire') {
    const order = await Order.updateOne(
      query,
      { 'payment.status': 'expired' },
      { new: true },
    )
    // send notification to User saying payment expired and
    // that he needs to request new one.
    return Promise.resolve(order)
  }
  return Promise.resolve(order)
}

export const cancelOrderMerchant = async (data) => {
  //   const orderData = await getOrder({
  //     _id: req.orderId,
  //     provider_id: req.user.id,
  //   })
  //   if (
  //     orderData.status == 'accepted' ||
  //     orderData.status == 'ongoing' ||
  //     orderData.status == 'completed' ||
  //     orderData.status == 'canceled' ||
  //     orderData.status == 'failed'
  //   ) {
  //     throw Error('Can not cancel order.')
  //   } else if (orderData.status == 'booked' || orderData.status == 'paid') {
  //     if (orderData.status == 'paid') {
  //       // todo: issue refund/partial refund
  //     }
  //     const updateData = {
  //       status: 'canceled',
  //       canceledBy: req.user.id,
  //       canceledAt: new Date(),
  //     }
  //     await Order.updateOne(
  //       { _id: req.orderId, provider_id: req.user.id },
  //       updateData,
  //     )
  //     // todo: add notification to customer about cancelation
  //     // todo: add cancelation message in messages between both parties
  //     // todo: remove unavailability from store account????
  //   }
  //   throw Error('Unknown status can not cancel order.')
}

export const approveOrder = async (
  orderId,
  approve,
  providerId,
  cancelReason,
) => {
  if (approve == 'accepted') {
    const orderData = await Order.updateOne(
      {
        order_id: orderId,
        provider_id: providerId,
        status: 'paid',
        'order.payment': 'paid',
      },
      { status: 'accepted' },
    )
  }
  if (approve == 'cancel') {
    const orderData = await Order.updateOne(
      {
        order_id: orderId,
        provider_id: providerId,
        status: 'paid',
        'order.payment': 'paid',
      },
      {
        status: 'canceled',
        canceled_by: providerId,
        canceled_at: new Date(),
        cancel_reason: cancelReason,
      },
    )
  }
  throw { error: 'unknown approve type', status: 400 }
}

// exports.cancelOrder = async (req, res, next) => {
//   const orderData = await getOrder({
//     _id: req.orderId,
//     customerId: req.user.id,
//   })
//   if (
//     orderData.status == 'accepted' ||
//     orderData.status == 'ongoing' ||
//     orderData.status == 'completed' ||
//     orderData.status == 'canceled' ||
//     orderData.status == 'failed'
//   ) {
//     throw Error('Can not cancel order.')
//   } else if (orderData.status == 'booked' || orderData.status == 'paid') {
//     if (orderData.status == 'paid') {
//       // todo: issue refund/partial refund
//     }
//     const updateData = {
//       status: 'canceled',
//       canceledBy: req.user.id,
//       canceledAt: new Date(),
//     }
//     await Order.updateOne(
//       { _id: req.orderId, customerId: req.user.id },
//       updateData,
//     )
//   }
//   throw Error('Unknown status can not cancel order.')
// }

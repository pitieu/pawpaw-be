import { v4 } from 'uuid'

import Order from '../model/Order.model.js'
import { fetchService } from '../controller/service.ctrl.js'
import { locationStrToArr } from '../utils/location.utils.js'

export const listOrders = (query = {}, options) => {
  return Order.find(query, options).lean()
}

export const listOrdersMerchant = (req, res, next) => {
  return listOrders({ providerId: req.user.id })
}

export const createOrder = async (data, customerId) => {
  // const customer = await fetchUser({ _id: customerId })

  const serviceData = await fetchService(
    { _id: data.serviceId },
    { 'photos.data': 0 },
  )
    .populate('category', 'platformFee platformFeeType')
    .populate('storeId', 'location')

  if (!serviceData) throw { error: 'Could not find service', status: 400 }
  if (!serviceData.category || !serviceData.category._id)
    throw { error: 'Could not find category', status: 400 }
  if (!serviceData.storeId || !serviceData.storeId._id)
    throw { error: 'Could not find store', status: 400 }

  const orderId = generateUniqueOrderId()

  const transportCost = await calculateTransportCost(
    serviceData.pricePerKm,
    serviceData.storeId.location,
    locationStrToArr(data.deliveryAddress),
  )

  const productsCost = await calculateProductsCost(data.products)
  const addonsCost = await calculateProductsCost(data.productAddons)
  const totalCost = await calculateTotalCost(
    productsCost,
    addonsCost,
    transportCost,
    serviceData.category.platformFee,
    serviceData.category.platformFeeType,
  )
  const orderData = {
    orderId: orderId,
    serviceProviderId: serviceData.userId,
    customerId: customerId,
    serviceId: data.serviceId,
    status: 'requested',
    platformFee: serviceData.category.platformFee,
    platformFeeType: serviceData.category.platformFeeType,
    platformCost: totalCost.platformCost,
    transportCost: transportCost,
    productsCost: productsCost,
    addonsCost: addonsCost,
    totalCost: totalCost.total,
    bookingPeriod: {
      start: data.bookingPeriodStart,
      end: data.bookingPeriodEnd,
    },
    deliveryAddress: data.deliveryAddress,
    notes: data.notes,
    products: data.products,
    productAddons: data.productAddons,
  }
  console.log(orderData)
  return Promise.resolve(orderData)
}

export const generateUniqueOrderId = () => {
  return v4()
}

export const calculateTransportCost = async (
  pricePerKm,
  address,
  destination,
) => {
  console.log(pricePerKm)
  pricePerKm = parseInt(pricePerKm)
  if (isNaN(pricePerKm)) throw { error: 'Invalid pricePerKm', status: 400 }

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
    throw { error: 'Invalid Product or Product amount', status: 400 }

  return cost
}

export const calculateTotalCost = async (
  productsCost,
  addonsCost,
  transportCost,
  platformFee,
  platformFeeType,
) => {
  const total = productsCost + addonsCost + transportCost
  let platformCost = platformFee
  if (platformFeeType === 'percent') {
    if (platformFee > 10)
      throw { error: 'platform fee can not be bigger than 10%', status: 400 }
    platformCost = total * (platformFee / 100)
    return { total: total + platformCost, platformCost: platformCost }
  }
  if (platformFee > 100000)
    throw { error: 'platform fee can not be bigger than 100.000', status: 400 }

  return { total: total + platformFee, platformCost: platformCost }
}

// exports.listOrders = (req, res, next) => {
//   return getOrder({ customerId: req.user.id })
// }

// exports.getOrder = (req, res, next) => {
//   return getOrder({ _id: req.orderId, customerId: req.user.id })
// }

// exports.getOrderMerchant = (req, res, next) => {
//   return getOrder({ _id: req.orderId, providerId: req.user.id })
// }

// exports.cancelOrderMerchant = async (req, res, next) => {
//   const orderData = await getOrder({
//     _id: req.orderId,
//     providerId: req.user.id,
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
//       { _id: req.orderId, providerId: req.user.id },
//       updateData,
//     )
//     // todo: add notification to customer about cancelation
//     // todo: add cancelation message in messages between both parties
//     // todo: remove unavailability from store account????
//   }
//   throw Error('Unknown status can not cancel order.')
// }

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

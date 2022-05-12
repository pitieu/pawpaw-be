const Order = require('../model/Order.model')

function getOrder(query) {
  return Order.get(query, (result) => {
    return result
  })
}

exports.listOrdersMerchant = (req, res, next) => {
  return getOrder({ providerId: req.user.id })
}

exports.listOrders = (req, res, next) => {
  return getOrder({ customerId: req.user.id })
}

exports.getOrder = (req, res, next) => {
  return getOrder({ _id: req.orderId, customerId: req.user.id })
}

exports.getOrderMerchant = (req, res, next) => {
  return getOrder({ _id: req.orderId, providerId: req.user.id })
}

exports.cancelOrderMerchant = async (req, res, next) => {
  const orderData = await getOrder({
    _id: req.orderId,
    providerId: req.user.id,
  })
  if (
    orderData.status == 'accepted' ||
    orderData.status == 'ongoing' ||
    orderData.status == 'completed' ||
    orderData.status == 'canceled' ||
    orderData.status == 'failed'
  ) {
    throw Error('Can not cancel order.')
  } else if (orderData.status == 'booked' || orderData.status == 'paid') {
    if (orderData.status == 'paid') {
      // todo: issue refund/partial refund
    }
    const updateData = {
      status: 'canceled',
      canceledBy: req.user.id,
      canceledAt: new Date(),
    }
    await Order.updateOne(
      { _id: req.orderId, providerId: req.user.id },
      updateData,
    )
    // todo: add notification to customer about cancelation
    // todo: add cancelation message in messages between both parties
    // todo: remove unavailability from store account????
  }
  throw Error('Unknown status can not cancel order.')
}

exports.cancelOrder = async (req, res, next) => {
  const orderData = await getOrder({
    _id: req.orderId,
    customerId: req.user.id,
  })
  if (
    orderData.status == 'accepted' ||
    orderData.status == 'ongoing' ||
    orderData.status == 'completed' ||
    orderData.status == 'canceled' ||
    orderData.status == 'failed'
  ) {
    throw Error('Can not cancel order.')
  } else if (orderData.status == 'booked' || orderData.status == 'paid') {
    if (orderData.status == 'paid') {
      // todo: issue refund/partial refund
    }
    const updateData = {
      status: 'canceled',
      canceledBy: req.user.id,
      canceledAt: new Date(),
    }
    await Order.updateOne(
      { _id: req.orderId, customerId: req.user.id },
      updateData,
    )
  }
  throw Error('Unknown status can not cancel order.')
}

exports.updateService = (req, res, next) => {
  const updateData = {
    name: req.name,
    description: req.description,
    location: req.location,
    photos: req.photos,
    product: req.products,
    productAddon: req.productAddon,
    pricePerKm: req.pricePerKm,
  }
  return Service.updateOne(
    { _id: req.serviceId, userId: req.user.id },
    updateData,
    (result) => {
      return result
    },
  )
}

exports.deleteService = (req, res, next) => {
  // services flagged as deleted should be deleted after a certain period
  const deleteData = {
    deletedAt: new Date(),
    deleted: true,
  }

  return Service.updateOne(
    { _id: req.serviceId, userId: req.user.id },
    deleteData,
    (result) => {
      return result
    },
  )
}

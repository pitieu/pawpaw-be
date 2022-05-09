const Service = require('../model/ServiceModel')

export const fetchService = async (query) => {
  query.deleted = false
  return await Service.findOne(query).lean()
}

export const listServices = (req, res, next) => {
  return getService({ userid: req.user.id })
}

export const listService = (req, res, next) => {
  return getService({ userid: req.user.id })
}

export const getService = (req, res, next) => {
  return getService({ _id: req.serviceId })
}

export const updateService = (req, res, next) => {
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

export const deleteService = (req, res, next) => {
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

export const addService = (req, res, next) => {
  return req
}

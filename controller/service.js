import Service from '../model/ServiceModel.js'
import ServiceCategory from '../model/ServiceCategoryModel.js'
import { addServiceValidation } from '../validation/service.js'
import { fetchStore } from './store.js'
import debug from '../utils/logger.js'

export const fetchService = async (query = {}, options) => {
  query.deleted = false
  debug.info(query)
  return await Service.findOne(query, options).lean()
}

export const listServices = async (query = {}, options) => {
  query.deleted = false
  debug.info(query)
  return await Service.find(query, options).lean()
}

export const listServiceCategories = async (query = {}, options) => {
  query.deleted = false
  debug.info(query)
  return await ServiceCategory.find(query, options).lean()
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

export const addService = async (data, ownerId) => {
  const serviceValidation = addServiceValidation(data)
  if (serviceValidation.error)
    throw {
      error: serviceValidation.error.details[0].message,
      status: 400,
    }

  const storeId = await fetchStore({ ownerId: ownerId })

  const serviceData = new Service({
    userId: ownerId,
    storeId: storeId._id,
    name: data.name,
    description: data.description,
    products: data.products,
    productAddons: data.productAddons,
    photos: data.photos,
    pricePerKm: data.pricePerKm,
    category: data.category,
  })

  return await serviceData.save()
}

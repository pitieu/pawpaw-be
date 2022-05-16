import Service from '../model/Service.model.js'
import ServiceCategory from '../model/ServiceCategory.model.js'
import { addServiceValidation } from '../validation/service.validation.js'
import { fetchStore } from './store.ctrl.js'
import debug from '../utils/logger.js'

export const fetchService = (query = {}, options) => {
  query.deleted = false
  debug.info(query)
  return Service.findOne(query, options).lean()
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

export const fetchServiceCategory = async (query = {}, options) => {
  query.deleted = false
  debug.info(query)
  return await ServiceCategory.findOne(query, options).lean()
}

export const updateService = (req, res, next) => {
  req.body.openingHours = convertOpeningHoursToJson(req.body.openingHours)

  const updateData = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    photos: req.body.photos,
    product: req.body.products,
    productAddon: req.body.productAddon,
    pricePerKm: req.body.pricePerKm,
    openingHours: req.body.openingHours,
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
    name: data.name.trim(),
    description: data.description.trim(),
    products: data.products,
    productAddons: data.productAddons,
    photos: data.photos,
    pricePerKm: data.pricePerKm,
    category: data.category,
    openingHours: data.openingHours,
    negotiableHours: data.negotiableHours == 'true',
    negotiableHoursRate: parseInt(data.negotiableHoursRate),
  })

  return await serviceData.save()
}

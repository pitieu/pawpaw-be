import Service from '../model/Service.model.js'
import ServiceCategory from '../model/ServiceCategory.model.js'
import { addServiceValidation } from '../validation/service.validation.js'
import { fetchStore } from './store.ctrl.js'
import debug from '../utils/logger.js'
import { convertOpeningHoursToJson } from '../validation/service.validation.js'

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

export const updateService = async (req, res, next) => {
  // Todo: finish update service
  if (req.body.opening_hours) {
    req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)
  }

  const updateData = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    photos: req.body.photos,
    product: req.body.products,
    product_addon: req.body.product_addon,
    price_per_km: req.body.price_per_km,
    opening_hours: req.body.opening_hours,
  }

  const ret = await Service.updateOne(
    { _id: req.service_id, user_id: req.user.id },
    updateData,
    (result) => {
      return result
    },
  )
  res.status(200).send(re)
}

export const deleteService = (req, res, next) => {
  // services flagged as deleted should be deleted after a certain period
  const deleteData = {
    deleted_at: new Date(),
    deleted_by: req.user._id,
    deleted: true,
  }

  return Service.updateOne(
    { _id: req.service_id, userId: req.user._id },
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

  const storeId = await fetchStore({ owner_id: ownerId })
  const category = await fetchServiceCategory({ key: data.category })
  if (!category) {
    throw { error: 'invalid category', status: 400 }
  }
  const serviceData = new Service({
    user_id: ownerId,
    store_id: storeId._id,
    name: data.name.trim(),
    description: data.description.trim(),
    products: data.products,
    product_addons: data.product_addons,
    photos: data.photos,
    price_per_km: data.price_per_km,
    category: category._id,
    opening_hours: data.opening_hours,
    negotiable_hours: data.negotiable_hours == 'true',
    negotiable_hours_rate: parseInt(data.negotiable_hours_rate),
  })

  return await serviceData.save()
}

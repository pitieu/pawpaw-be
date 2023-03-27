import Service from '../model/Service.model.js'
import ServiceCategory from '../model/ServiceCategory.model.js'
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

export const isOwnerOfService = (serviceId, userId) => {
  return Service.count({
    user_id: userId,
    _id: serviceId,
    deleted: false,
  }).lean()
}

export const updateService = (data, userId) => {
  const updateData = {
    name: data.name.trim(),
    description: data.description?.trim(),
    products: data.products,
    product_addons: data.product_addons,
    photos: data.photos,
    delivery: {
      price_per_km: data.price_per_km || 0,
      delivery_location_store: data.delivery_location_store,
      delivery_location_home: data.delivery_location_home,
    },
  }

  return Service.updateOne({ _id: data.id, user_id: userId }, updateData)
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
  const storeId = await fetchStore({ owner_id: ownerId })
  const category = await fetchServiceCategory({ key: data.category })
  if (!category) {
    throw { error: 'invalid category', status: 400 }
  }
  const _data = {
    user_id: ownerId,
    store_id: storeId._id,
    name: data.name.trim(),
    description: data.description?.trim(),
    products: data.products,
    product_addons: data.product_addons,
    photos: data.photos,
    category: category._id,
    delivery: {
      price_per_km: data.price_per_km || 0,
      delivery_location_store: data.delivery_location_store,
      delivery_location_home: data.delivery_location_home,
    },
    // opening_hours: data.opening_hours,
    // negotiable_hours: data.negotiable_hours == 'true',
    // negotiable_hours_rate: parseInt(data.negotiable_hours_rate),
  }
  const serviceData = new Service(_data)
  const created = await serviceData.save()
  return created
}

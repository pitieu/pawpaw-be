import { createStoreValidation } from '../validation/store.js'
import Store from '../model/Store.model.js'
import debug from '../utils/logger.js'

export const fetchStore = async (query = {}, options) => {
  query.deleted = false
  const storeData = await Store.findOne(query, options).lean()
  return storeData
}

export const updateStore = async (newData) => {
  // console.log('update store', newData)

  if (!newData.ownerId) throw { error: 'OwnerId is required', status: 400 }

  const nameExists = await StoreNameExists(newData.name, newData.ownerId)
  if (nameExists) throw { error: 'Store name already exists', status: 400 }

  const sanitizedData = {
    name: newData.name.trim(),
    photo: newData.photo,
    locations: newData.locations,
    open: newData.open,
    reopenDate: newData.reopenDate,
    unavailable: newData.unavailable,
  }

  const storeData = await Store.findOneAndUpdate(
    { ownerId: newData.ownerId, deleted: false },
    sanitizedData,
  )
  return storeData
}

export const storeExists = async (storeId) => {
  const storeByOwnerId = await fetchStore({
    ownerId: storeId,
  })
  return storeByOwnerId ? true : false
}

export const StoreNameExists = async (name, ownerId) => {
  const storeByName = await fetchStore({
    name: name.trim(),
    ownerId: { $ne: ownerId },
  })
  return storeByName ? true : false
}

export const createStore = async (data) => {
  const storeExist = await storeExists(data.ownerId)
  if (storeExist) throw { error: 'User already has a store', status: 400 }

  const nameExists = await StoreNameExists(data.name, data.ownerId)
  if (nameExists) throw { error: 'Store name already exists', status: 400 }

  const storeValidation = createStoreValidation(data)
  if (storeValidation.error) {
    throw {
      error: storeValidation.error.details[0].message,
      status: 400,
    }
  }

  try {
    const storeData = new Store({
      ownerId: data.ownerId,
      name: data.name,
      photo: data.photo,
      locations: data.locations,
    })
    return await storeData.save()
  } catch (e) {
    console.log(e)
    throw { error: 'Failed to create store', status: 400 }
  }
}

export const deleteStore = async (ownerId) => {
  if (!ownerId) throw { error: 'OwnerId is required', status: 400 }
  // Todo: delete services also
  return await Store.findOneAndUpdate(
    { ownerId: ownerId, deleted: false },
    { deleted: true, deletedBy: ownerId, deletedAt: new Date() },
    { new: true },
  )
}

import { updateStoreValidation } from '../validation/store.validation.js'
import Store from '../model/Store.model.js'
import debug from '../utils/logger.js'

export const fetchStore = async (query = {}, options) => {
  query.deleted = false
  const storeData = await Store.findOne(query, options).lean()
  return storeData
}

export const updateStore = async (newData) => {
  if (!newData.owner_id) throw { error: 'owner_id is required', status: 400 }

  const sanitizedData = {
    open: newData.open,
    reopen_date: newData.reopen_date,
    unavailable: newData.unavailable,
    opening_hours: newData.opening_hours,
  }

  const storeValidation = updateStoreValidation(sanitizedData)
  if (storeValidation.error) {
    throw {
      error: storeValidation.error.details[0].message,
      status: 400,
    }
  }

  const storeData = await Store.findOneAndUpdate(
    { owner_id: newData.owner_id, deleted: false },
    sanitizedData,
  )
  return storeData
}

export const storeExists = async (ownerId) => {
  const storeByOwnerId = await fetchStore({
    owner_id: ownerId,
  })
  return storeByOwnerId ? true : false
}

export const createStore = async (ownerId) => {
  const storeExist = await storeExists(ownerId)
  if (storeExist) throw { error: 'user already has a store', status: 400 }

  try {
    const storeData = new Store({
      owner_id: ownerId,
    })
    return await storeData.save()
  } catch (e) {
    console.log(e)
    throw { error: 'failed to create store', status: 400 }
  }
}

export const deleteStore = async (ownerId) => {
  if (!ownerId) throw { error: 'owner_id is required', status: 400 }
  // Todo: delete services also
  return await Store.findOneAndUpdate(
    { owner_id: ownerId, deleted: false },
    { deleted: true, deletedBy: ownerId, deletedAt: new Date() },
    { new: true },
  )
}

import { updateStoreValidation } from '../validation/store.validation.js'
import Store from '../model/Store.model.js'
import debug from '../utils/logger.js'
import { badRequestError, internalServerError } from '../utils/error.utils.js'

const ERR_MSG = {
  missingOwnerId: 'Owner ID is required',
  couldNotFetch: 'Could not fetch store',
  couldNotUpdate: 'Could not update store',
  couldNotCreate: 'Could not create store',
  couldNotDelete: 'Could not delete store',
}

export const fetchStore = async (query = {}, options) => {
  try {
    query.deleted = false
    const storeData = await Store.findOne(query, options).lean()
    return storeData
  } catch (err) {
    throw new internalServerError(ERR_MSG.couldNotFetch)
  }
}

export const updateStore = async (storeData) => {
  try {
    if (!storeData.owner_id) throw new badRequestError(ERR_MSG.missingOwnerId)

    const sanitizedData = {
      open: storeData.open,
      reopen_date: storeData.reopen_date,
      unavailable: storeData.unavailable,
      opening_hours: storeData.opening_hours,
    }

    const storeValidation = updateStoreValidation(sanitizedData)
    if (storeValidation.error) {
      throw new badRequestError(storeValidation.error.details[0].message)
    }

    const updatedStoreData = await Store.findOneAndUpdate(
      { owner_id: storeData.owner_id, deleted: false },
      sanitizedData,
    )
    return updatedStoreData
  } catch (err) {
    throw new internalServerError(ERR_MSG.couldNotUpdate)
  }
}

export const createStore = async (ownerId, accountId, session) => {
  try {
    const res = await Store.insertMany(
      [
        {
          owner_id: ownerId,
          account_id: accountId,
        },
      ],
      { session: session },
    )
    return res[0]
  } catch (e) {
    throw new internalServerError(ERR_MSG.couldNotCreate)
  }
}

export const deleteStore = async (ownerId) => {
  try {
    if (!ownerId) throw new badRequestError(ERR_MSG.missingOwnerId)
    // Todo: delete services also
    return await Store.findOneAndUpdate(
      { owner_id: ownerId, deleted: false },
      { deleted: true, deletedBy: ownerId, deletedAt: new Date() },
      { new: true },
    )
  } catch (e) {
    throw new internalServerError(ERR_MSG.couldNotDelete)
  }
}

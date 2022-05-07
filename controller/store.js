import Store from '../model/StoreModel.js'
import debug from '../utils/logger.js'

export const fetchStore = async (query) => {
  const storeData = await Store.findOne(query)
  return storeData
}

export const updateStore = (req, res, next) => {
  res.send('works')
}

export const storeExists = async (storeId) => {
  const storeByOwnerId = await Store.findOne({
    ownerId: storeId,
  })
  return storeByOwnerId ? true : false
}

export const StoreNameExists = async (name) => {
  const storeByName = await Store.findOne({
    name: name.trim(),
  })
  return storeByName ? true : false
}

export const createStore = async (data) => {
  const storeExist = await storeExists(data.ownerId)
  if (storeExist) throw { error: 'User already has a store', status: 400 }

  const nameExists = await StoreNameExists(data.ownerId)
  if (nameExists) throw { error: 'Store name already exists', status: 400 }

  const storeValidation = createStoreValidation(data)
  if (storeValidation.error()) {
    throw {
      error: storeValidation.error.details[0].message,
      status: 400,
    }
  }

  try {
    const data = new Store({
      ownerId: data.ownerId,
      name: data.name,
      photo: data.photo,
      locations: data.locations,
    })
    let storeCreated = await data.save()
    res.status(201).send({ _id: storeCreated._id })
  } catch (e) {
    debug.error(req.user._id, e.message)
    res.status(400).send({ error: 'Failed to create store' })
  }
}

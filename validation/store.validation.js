import Joi from 'joi'

export const getStoreValidation = (data) => {
  const schema = Joi.object({
    storeId: Joi.string(),
  })
  return schema.validate(data)
}

export const createStoreValidation = (data) => {
  const schema = Joi.object({
    ownerId: Joi.string().required(),
    name: Joi.string().min(3).required(),
    photo: Joi.object(),
    location: Joi.array().items(Joi.number()),
  })
  return schema.validate(data)
}

export const filterStorePublicFields = (data) => {
  return {
    _id: data._id,
    ownerId: data.ownerId,
    name: data.name,
    location: data.locations,
    unavailable: data.unavailable,
    photo: data.photo,
  }
}

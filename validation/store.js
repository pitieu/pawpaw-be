import Joi from 'joi'

export const getStoreValidation = (data) => {
  const schema = Joi.object({
    storeId: Joi.string(),
  })
  return schema.validate(data)
}

export const createStoreValidation = () => {
  const schema = Joi.object({
    ownerId: Joi.string().required(),
    name: Joi.string().required(),
    photo: Joi.string(),
    locations: Joi.number(),
  })
  return schema.validate(data)
}

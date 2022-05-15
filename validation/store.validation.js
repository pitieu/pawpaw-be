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
    openingHours: Joi.object({
      mon: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      tue: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      wed: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      thu: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      fri: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      sat: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
      sun: Joi.object({
        openingHour: Joi.number(),
        closingHour: Joi.number(),
        open: Joi.boolean(),
      }),
    }),
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
    openingHours: data.openingHours,
  }
}

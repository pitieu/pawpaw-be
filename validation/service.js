import Joi from 'joi'

export const addServiceValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
    photos: Joi.array(),
    products: Joi.array().items(
      Joi.object({
        name: Joi.string().min(3),
        description: Joi.string(),
        price: Joi.number().min(0),
        // bookingPeriod: Joi.object({
        //   start: Joi.date(),
        //   end: Joi.date(),
        // }),
        selectable: Joi.bool(),
      }),
    ),
    productAddons: Joi.array().items(
      Joi.object({
        name: Joi.string().min(3),
        description: Joi.string(),
        price: Joi.number().min(0),
        // bookingPeriod: Joi.object({
        //   start: Joi.date(),
        //   end: Joi.date(),
        // }),
        selectable: Joi.bool(),
      }),
    ),
    pricePerKm: Joi.string(),
  })

  return schema.validate(data)
}

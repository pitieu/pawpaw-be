import Joi from 'joi'
import { convertOpeningHoursToJson as convertOpeningHours } from './store.validation.js'

export const addServiceValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
    photos: Joi.array().items(
      Joi.object({
        filename: Joi.string().min(3),
        data: Joi.binary(),
        contentType: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg'),
      }),
    ),
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
    pricePerKm: Joi.number(),
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
    negotiableHours: Joi.boolean(),
    negotiableHoursRate: Joi.number(),
  })

  return schema.validate(data)
}

export const convertOpeningHoursToJson = convertOpeningHours

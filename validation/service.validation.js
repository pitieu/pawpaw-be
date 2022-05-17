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
        content_type: Joi.string().valid(
          'image/png',
          'image/jpeg',
          'image/jpg',
        ),
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
    product_addons: Joi.array().items(
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
    price_per_km: Joi.number(),
    opening_hours: Joi.object({
      mon: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      tue: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      wed: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      thu: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      fri: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      sat: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
      sun: Joi.object({
        opening_hour: Joi.number(),
        closing_hour: Joi.number(),
        open: Joi.boolean(),
      }),
    }),
    negotiable_hours: Joi.boolean(),
    negotiable_hours_rate: Joi.number(),
  })

  return schema.validate(data)
}

export const convertOpeningHoursToJson = convertOpeningHours

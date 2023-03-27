import Joi from 'joi'
import { convertOpeningHoursToJson as convertOpeningHours } from './store.validation.js'

const product = Joi.array().items(
  Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().min(3),
    description: Joi.string().optional().allow(''),
    price: Joi.number().min(0),
    time: Joi.string().optional().allow(''),
    timeSelected: Joi.boolean(),
    weight: Joi.object({
      start: Joi.number().optional().allow(''),
      end: Joi.number().optional().allow(''),
    }),
    weightSelected: Joi.boolean(),
    // bookingPeriod: Joi.object({
    //   start: Joi.date(),
    //   end: Joi.date(),
    // }),
    selectable: Joi.bool(),
  }),
)

export const serviceValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().optional(),
    stored_photos: Joi.optional(),
    photos: Joi.optional(),
    name: Joi.string().min(5).required(),
    description: Joi.string().optional().allow(''),
    category: Joi.string(),
    products: product,
    product_addons: product,
    price_per_km: Joi.number().optional(),
    delivery_location_store: Joi.boolean(),
    delivery_location_home: Joi.boolean(),
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

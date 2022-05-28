import Joi from 'joi'

export const getStoreValidation = (data) => {
  const schema = Joi.object({
    store_id: Joi.string(),
  })
  return schema.validate(data)
}

export const updateStoreValidation = (data) => {
  const schema = Joi.object({
    open: Joi.boolean(),
    reopen_date: Joi.date(),
    unavailable: Joi.array().items(Joi.date()),
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
  })
  return schema.validate(data)
}

export const createStoreValidation = (data) => {
  const schema = Joi.object({
    owner_id: Joi.string().required(),
  })
  return schema.validate(data)
}

export const filterStorePublicFields = (data) => {
  return {
    _id: data._id,
    owner_id: data.owner_id,
    name: data.name,
    location: data.locations,
    unavailable: data.unavailable,
    photo: data.photo,
    opening_hours: data.opening_hours,
  }
}

export const convertOpeningHoursToJson = (strOpeningHours) => {
  if (typeof strOpeningHours != 'object') {
    let openingHours = JSON.parse(strOpeningHours)

    var result = {}
    var keys = Object.keys(openingHours)
    keys.forEach(function (item) {
      openingHours[item].opening_hour = parseInt(
        openingHours[item].opening_hour,
      )
      openingHours[item].closing_hour = parseInt(
        openingHours[item].closing_hour,
      )
      openingHours[item].open = openingHours[item].open == 'true'
      result[item] = openingHours[item]
    })
    return result
  }
  return strOpeningHours
}

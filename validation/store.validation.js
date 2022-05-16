import Joi from 'joi'

export const getStoreValidation = (data) => {
  const schema = Joi.object({
    storeId: Joi.string(),
  })
  return schema.validate(data)
}

export const updateStoreValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
    photo: Joi.object({
      filename: Joi.string(),
      data: Joi.binary(),
      contentType: Joi.string().valid('image/png', 'image/jpeg', 'image/jpg'),
    }),
    location: Joi.array().items(Joi.number()),
    open: Joi.boolean(),
    reopenDate: Joi.date(),
    unavailable: Joi.array().items(Joi.date()),
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

export const createStoreValidation = (data) => {
  const schema = Joi.object({
    ownerId: Joi.string().required(),
    name: Joi.string().min(3).required(),
    photo: Joi.object({
      filename: Joi.string(),
      data: Joi.binary(),
      contentType: Joi.string(),
    }),
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

export const convertOpeningHoursToJson = (strOpeningHours) => {
  if (typeof strOpeningHours != 'object') {
    let openingHours = JSON.parse(strOpeningHours)

    var result = {}
    var keys = Object.keys(openingHours)
    keys.forEach(function (item) {
      openingHours[item].openingHour = parseInt(openingHours[item].openingHour)
      openingHours[item].closingHour = parseInt(openingHours[item].closingHour)
      openingHours[item].open = openingHours[item].open == 'true'
      result[item] = openingHours[item]
    })
    return result
  }
  return strOpeningHours
}

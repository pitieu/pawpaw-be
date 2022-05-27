import Joi from 'joi'

export const registrationValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(2).required(),
    phone: Joi.string().min(6).required(),
    phone_ext: Joi.string().max(10).required(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

export const loginValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string().min(6).required(),
    phone_ext: Joi.string().max(10).required(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

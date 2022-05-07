import Joi from 'joi'

export const addServiceValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(2).required(),
    phone: Joi.string().min(6).required(),
    phoneExt: Joi.string().max(3).required(),
    password: Joi.string().min(6).required(),
    password2: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

import Joi from 'joi'

export const addServiceValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
  })
  return schema.validate(data)
}

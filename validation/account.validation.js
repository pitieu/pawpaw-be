import Joi from 'joi'

export const filterUserPublicFields = (data) => {
  return {
    _id: data._id,
    username: data.username,
    phone: data.phone,
    phone_ext: data.phone_ext,
  }
}

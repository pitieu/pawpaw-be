import Joi from 'joi'

export const filterUserPublicFields = (data) => {
  return {
    _id: data._id,
    username: data.username,
    phone: data.phone,
    phone_ext: data.phone_ext,
    website: data.website,
    biography: data.biography,
    gender: data.gender,
    location: data.location,
    email: data.email,
    profile: data.photo?.filename,
    geo: data.geo,
    phone_validated: data.phone_validated,
    bank_details: data.bank_details,
    selected_account: data.selected_account,
  }
}

export const filterAccountPublicFields = (data) => {
  return {
    _id: data._id,
    username: data.username,
    phone: data.phone,
    phone_ext: data.phone_ext,
    website: data.website,
    biography: data.biography,
    gender: data.gender,
    location: data.location,
    email: data.email,
    profile: data.photo?.filename,
    geo: data.geo,
    bank_details: data.bank_details,
    selected_account: data.selected_account,
  }
}

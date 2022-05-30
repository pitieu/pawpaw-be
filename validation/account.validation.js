import Joi from 'joi'

export const filterUserPublicFields = (data) => {
  return {
    _id: data._id,
    phone: data.phone,
    phone_ext: data.phone_ext,
    phone_validated: data.phone_validated,
    email_validated: data.email_validated,
    selected_account: {
      _id: data.selected_account._id,
      username: data.selected_account.username,
      website: data.selected_account.website,
      biography: data.selected_account.biography,
      gender: data.selected_account.gender,
      location: data.selected_account.location,
      email: data.selected_account.email,
      profile: data.selected_account.photo?.filename,
      geo: data.selected_account.geo,
      bank_details: data.selected_account.bank_details,
    },
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

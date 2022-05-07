const User = require('../model/UserModel')

export const user = (req, res, next) => {
  return req.user
}

function getUser(query) {
  return User.get(query, (result) => {
    return result
  })
}

export const getUser = (req, res, next) => {
  return getUser({ _id: req.user.id })
}

export const updateUser = (req, res, next) => {
  const updateData = {
    fullname: req.fullname,
    website: req.website,
    biography: req.biography,
    gender: req.gender,
    location: req.location,
    profilePhoto: req.profilePhoto,
    geo: req.geo,
  }
  return User.updateOne({ _id: req.user.id }, updateData, (result) => {
    return result
  })
}

export const deleteUser = (req, res, next) => {
  // users flagged as deleted should be deleted after a certain period
  const deleteData = {
    deletedAt: new Date(),
    deleted: true,
  }

  return User.updateOne({ _id: req.user.id }, deleteData, (result) => {
    return result
  })
}

export const updatePhone = (req, res, next) => {
  const updateData = {
    phone: req.phone,
    phoneExt: req.phoneExt,
  }

  return User.updateOne({ _id: req.user.id }, updateData, (result) => {
    return result
  })
}

export const updateEmail = (req, res, next) => {
  const updateData = {
    email: req.email,
  }

  return User.updateOne({ _id: req.user.id }, updateData, (result) => {
    return result
  })
}

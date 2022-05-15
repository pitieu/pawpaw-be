import User from '../model/User.model.js'
import { registrationValidation } from '../validation/auth.validation.js'
import { generateHashedPassword } from './auth.ctrl.js'

export const fetchUser = async (query = {}, options) => {
  query.deleted = false
  const user = await User.findOne(query, options).lean()
  return user
}

// export const updateUser = (req, res, next) => {
//   const updateData = {
//     fullname: req.fullname,
//     website: req.website,
//     biography: req.biography,
//     gender: req.gender,
//     location: req.location,
//     profilePhoto: req.profilePhoto,
//     geo: req.geo,
//   }
//   return User.updateOne({ _id: req.user.id }, updateData, (result) => {
//     return result
//   })
// }

// export const deleteUser = (req, res, next) => {
//   // users flagged as deleted should be deleted after a certain period
//   const deleteData = {
//     deletedAt: new Date(),
//     deleted: true,
//   }

//   return User.updateOne({ _id: req.user.id }, deleteData, (result) => {
//     return result
//   })
// }

// export const updatePhone = (req, res, next) => {
//   const updateData = {
//     phone: req.phone,
//     phoneExt: req.phoneExt,
//   }

//   return User.updateOne({ _id: req.user.id }, updateData, (result) => {
//     return result
//   })
// }

// export const updateEmail = (req, res, next) => {
//   const updateData = {
//     email: req.email,
//   }

//   return User.updateOne({ _id: req.user.id }, updateData, (result) => {
//     return result
//   })
// }

export const phoneExists = async (phone, phoneExt) => {
  const userByPhone = await User.findOne({
    phone: phone,
    phoneExt: phoneExt,
  })
  return userByPhone ? true : false
}

export const usernameExists = async (username) => {
  const userByUsername = await User.findOne({ username: username })
  return userByUsername ? true : false
}

export const createAccount = async (data) => {
  if (data.password != data.password2) {
    throw {
      error: 'Password and Repeat Password do not match.',
      status: 400,
    }
  }
  const validateRegister = registrationValidation(data)
  if (validateRegister.error) {
    throw {
      error: validateRegister.error.details[0].message,
      status: 400,
    }
  }

  const phoneExist = await phoneExists(data.phone, data.phoneExt)
  if (phoneExist) {
    throw { error: 'Phone number already exists', status: 400 }
  }
  const usernameExist = await usernameExists(data.username)
  if (usernameExist) {
    throw { error: 'Username already exists', status: 400 }
  }
  const hashedPassword = await generateHashedPassword(data.password)

  const userData = new User({
    username: data.username,
    location: data.location,
    phone: data.phone,
    phoneExt: data.phoneExt,
    password: hashedPassword,
  })
  const savedUser = await userData.save()
  return savedUser._id
}

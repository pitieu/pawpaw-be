import Order from '../model/Order.model.js'
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

export const accountsCount = async (phone, phone_ext) => {
  const userByPhone = await User.count({
    phone: phone,
    phone_ext: phone_ext,
  })
  return userByPhone
}

export const usernameExists = async (username) => {
  const userByUsername = await User.findOne({ username: username })
  return userByUsername ? true : false
}

export const createAccount = async (data) => {
  const validateRegister = registrationValidation(data)
  if (validateRegister.error) {
    throw {
      error: validateRegister.error?.details[0]?.message,
      status: 400,
      error_field: validateRegister.error?.details[0]?.context?.key,
      error_type: validateRegister.error?.details[0]?.type,
      error_code: 100,
    }
  }

  const acctCount = await accountsCount(data.phone, data.phone_ext)
  if (acctCount >= 5) {
    throw {
      error: 'maximum of 5 accounts reached per phone number',
      status: 400,
      error_code: 103,
    }
  }

  const usernameExist = await usernameExists(data.username)
  if (usernameExist) {
    throw { error: 'username already exists', status: 400, error_code: 104 }
  }
  const hashedPassword = await generateHashedPassword(data.password)

  const userData = new User({
    username: data.username,
    phone: data.phone,
    phone_ext: data.phone_ext,
    password: hashedPassword,
  })
  const savedUser = await userData.save()
  return savedUser._id
}

export const balancePending = async (providerId) => {
  const total = await Order.aggregate({
    $match: {
      provider_id: providerId,
      'payment_merchant.status': 'pending',
      'payment.status': 'paid',
      status: 'pay_merchant',
      'payment_merchant.withdraw_allowed_after': { $gte: new Date() },
    },
    $group: {
      // sums all documents together
      _id: null,
      total: {
        $sum: { $add: ['$transport_cost', '$products_cost', '$addons_cost'] },
      },
    },
  })

  if (!total) {
    // no records found matching
    return 0
  }

  return total.total
}

export const balanceWithdrawable = async (providerId) => {
  const total = await Order.aggregate({
    $match: {
      provider_id: providerId,
      'payment_merchant.status': 'pending',
      'payment.status': 'paid',
      status: 'pay_merchant',
      'payment_merchant.withdraw_allowed_after': { $lt: new Date() },
    },
    $group: {
      // sums all documents together
      _id: null,
      total: {
        $sum: { $add: ['$transport_cost', '$products_cost', '$addons_cost'] },
      },
    },
  })

  if (!total) {
    // no records found matching
    return 0
  }

  return total.total
}

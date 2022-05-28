import Order from '../model/Order.model.js'
import User from '../model/User.model.js'
import { registrationValidation } from '../validation/auth.validation.js'
import { generateHashedPassword } from './auth.ctrl.js'
import debug from '../utils/logger.js'
import { mongooseInstance } from '../mongodb/mongo.js'

export const fetchUser = async (query = {}, options) => {
  query.deleted = false
  query.selected_account = true
  debug.info(query)
  const user = await User.findOne(query, options).lean()
  return user
}

export const fetchAccounts = async (query = {}, options) => {
  query.deleted = false
  // query.selected_account = true
  // debug.info(query)
  const user = await User.find(query, options).lean()
  return user
}

export const selectAccount = async (data) => {
  let session = await mongooseInstance.startSession()
  session.startTransaction()
  try {
    await User.updateMany(
      { phone: data.phone, phone_ext: data.phone_ext },
      { selected_account: false },
      { session },
    )
    const selectTrue = await User.updateOne(
      { phone: data.phone, phone_ext: data.phone_ext, _id: data.user_id },
      { selected_account: true },
      { session },
    )

    if (selectTrue.matchedCount != 1) {
      throw { error: 'failed to select account', status: 400 }
    }
    await session.commitTransaction()
  } catch (e) {
    await session.abortTransaction()
    throw e
  }
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
    deleted: false,
  })
  return userByPhone
}

export const usernameExists = async (username) => {
  const userByUsername = await User.findOne({ username: username })
  return userByUsername ? true : false
}

export const createAccount = async (data) => {
  // TODO: prevent user to create account if he is in a ban list
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

  // set all owned account as not selected
  await User.updateMany(
    { phone: data.phone, phone_ext: data.phone_ext },
    { selected_account: false },
  )

  const userData = new User({
    username: data.username,
    phone: data.phone,
    phone_ext: data.phone_ext,
    password: hashedPassword,
    selected_account: true,
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

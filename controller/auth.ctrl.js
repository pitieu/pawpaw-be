import bcrypt from 'bcryptjs'

import debug from '../utils/logger.js'
import User from '../model/User.model.js'
import { signJWT } from '../utils/jwt.utils.js'

import { loginValidation } from '../validation/auth.validation.js'

export const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const validatePassword = (password, userPassword) => {
  return bcrypt.compare(password, userPassword)
}

export const login = async (data) => {
  const validateLogin = loginValidation(data)
  if (validateLogin.error)
    throw {
      error: validateLogin.error?.details[0]?.message,
      status: 400,
      error_field: validateLogin.error?.details[0]?.context?.key,
      error_type: validateLogin.error?.details[0]?.type,
      error_code: 100,
    }

  const user = await User.findOne({
    phone: data.phone,
    phone_ext: data.phone_ext,
  })

  if (!user)
    throw {
      error: 'phone number not found',
      status: 400,
      error_code: 101,
    }

  const validPassword = await validatePassword(data.password, user.password)
  if (!validPassword)
    throw {
      error: 'invalid password',
      status: 400,
      error_code: 102,
    }

  const userFiltered = {
    _id: user._id,
    username: user.username,
    phone: user.phone,
    phone_ext: user.phone_ext,
  }

  const accessToken = signJWT(
    userFiltered,
    process.env.ACCESS_TOKEN_SECRET,
    '1y',
  )
  const refreshToken = signJWT(
    userFiltered,
    process.env.REFRESH_TOKEN_SECRET,
    '1y',
  )
  return { accessToken: accessToken, refreshToken: refreshToken }
}

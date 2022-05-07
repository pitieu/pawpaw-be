import bcrypt from 'bcryptjs'
import { verifyJWT } from '../utils/jwt.utils.js'

export const isLoggedIn = (req, res, next) => {
  const token = req.header('auth-token')
  console.log(token)
  if (!token) return res.status(401).send('Access Denied')

  try {
    req.user = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET, '15s')
    if (req.user.expired !== false) {
      return res.status(400).send('Token expired')
    }
    if (req.user.payload) {
      return next()
    }
    res.status(400).send('Invalid Token')
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}

export const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const validatePassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword)
}

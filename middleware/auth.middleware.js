import passport from 'passport'
import session from 'express-session'

import { verifyJWT } from '../utils/jwt.utils.js'
import { unauthorizedError } from '../utils/error.utils.js'

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
})

// serialize and deserialize user functions
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

export const passportMiddleware = passport.initialize()

// Deny Access if token is invalid or missing in auth-token
export const authArea = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) throw new unauthorizedError('Access Denied')

  try {
    const { payload, expired } = verifyJWT(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      '1y',
    )
    req.user = payload
    if (expired !== false) {
      throw new unauthorizedError('Token expired')
    }
    if (payload) {
      return next()
    }
    throw new unauthorizedError('Invalid Token')
  } catch (err) {
    throw new unauthorizedError('Invalid Token')
  }
}

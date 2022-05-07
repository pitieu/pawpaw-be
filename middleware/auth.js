import { verifyJWT } from '../utils/jwt.utils.js'

// Deny Access if token is invalid or missing in auth-token
export const loggedInArea = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) return res.status(401).send('Access Denied')

  try {
    const { payload, expired } = verifyJWT(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      '1y',
    )
    req.user = payload
    if (expired !== false) {
      return res.status(400).send('Token expired')
    }
    if (payload) {
      return next()
    }
    res.status(400).send('Invalid Token')
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}

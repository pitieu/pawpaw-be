import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import debug from '../utils/logger.js'
import { signJWT } from '../utils/jwt.utils.js'
import User from '../model/User.model.js'

import { loginValidation } from '../validation/auth.validation.js'
import { validatePassword } from '../controller/auth.ctrl.js'
import { createAccount } from '../controller/account.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'

dotenv.config({ path: './.env' })

const router = express.Router()

let refreshTokens = []

const _register = async (req, res, next) => {
  try {
    const userId = await createAccount(req.body)
    res.status(201).send({ _id: userId._id })
  } catch (err) {
    next(err)
  }
}
const _login = async (req, res, next) => {
  try {
    const validateLogin = loginValidation(req.query)
    if (validateLogin.error)
      return res.status(400).send(validateLogin.error.details[0].message)

    const user = await User.findOne({
      phone: req.query.phone,
      phoneExt: req.query.phoneExt,
    })
    if (!user) return res.status(400).send('Phone number not found')

    const validPassword = validatePassword(req.query.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid password')

    const userFiltered = {
      _id: user._id,
      username: user.username,
      phone: user.phone,
      phoneExt: user.phoneExt,
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

    res.cookie('accessToken', accessToken, {
      maxAge: 300000, // 5 minutes
      httpOnly: true,
    })
    res.cookie('accessToken', accessToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
    })

    refreshTokens.push(refreshToken)
    res
      .header('auth-token', accessToken)
      .json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

const _token = (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ username: user.name })
    res.json({ accessToken: accessToken })
  })
}
const _logout = (req, res) => {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  })
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  })

  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
}

router.get('/protected', authArea, async (req, res, next) => {
  res.status(200).send('Has access')
})
router.post('/register', _register)
router.get('/login', _login)
router.post('/token', _token)
router.delete('/logout', _logout)

export default router

import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import debug from '../utils/logger.js'
import { signJWT } from '../utils/jwt.utils.js'
import User from '../model/UserModel.js'

import { registrationValidation, loginValidation } from '../validation/auth.js'
import {
  generateHashedPassword,
  validatePassword,
  isLoggedIn,
} from '../controller/auth.js'

dotenv.config({ path: './.env' })

const router = express.Router()

let refreshTokens = []

router.post('/register', async (req, res, next) => {
  try {
    if (req.body.password != req.body.password2) {
      return res
        .status(400)
        .send({ error: 'Password and Repeat Password do not match.' })
    }

    const validateRegister = registrationValidation(req.body)
    if (validateRegister.error) {
      return res
        .status(400)
        .send({ error: validateRegister.error.details[0].message })
    }

    const phoneExists = await User.findOne({
      phone: req.body.phone,
      phoneExt: req.body.phoneExt,
    })
    if (phoneExists) {
      return res.status(400).send({ error: 'Phone number already exists' })
    }
    const usernameExists = await User.findOne({ username: req.body.username })
    if (usernameExists) {
      return res.status(400).send({ error: 'Username already exists' })
    }

    const hashedPassword = await generateHashedPassword(req.body.password)
    const user = new User({
      username: req.body.username,
      location: req.body.location,
      phone: req.body.phone,
      phoneExt: req.body.phoneExt,
      password: hashedPassword,
    })

    try {
      const savedUser = await user.save()
      return res.status(201).send({ user: savedUser._id })
    } catch (err) {
      debug.error(err)
      next(err)
    }
  } catch (err) {
    debug.error(err)
    next(err)
  }
})

router.get('/protected', isLoggedIn, async (req, res, next) => {
  res.status(200).send('Has access')
})

router.get('/login', async (req, res, next) => {
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
      '15s',
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
})

router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ username: user.name })
    res.json({ accessToken: accessToken })
  })
})

router.delete('/logout', (req, res) => {
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
})

export default router

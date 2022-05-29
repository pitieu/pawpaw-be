import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { mongooseInstance } from '../mongodb/mongo.js'
import debug from '../utils/logger.js'
import { login } from '../controller/auth.ctrl.js'
import {
  createAccount,
  createUser,
  accountsCountByPhone,
} from '../controller/account.ctrl.js'
import { createStore } from '../controller/store.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'
import User from '../model/User.model.js'
import Account from '../model/Account.model.js'

dotenv.config({ path: './.env' })

const router = express.Router()

let refreshTokens = []

const _register = async (req, res, next) => {
  let session = await mongooseInstance.startSession()
  try {
    // await session.startTransaction()
    // TODO: add mongoose transaction to prevent creation of account and fail store creation
    await session.withTransaction(async () => {
      const userData = await createUser(req.body, session)
      req.body.user_id = userData._id
      const accountData = await createAccount(req.body, session)
      return createStore(userData._id, accountData._id, session)
    })
    try {
      // login the account right away after registration
      const tokens = await login({
        phone: req.body.phone,
        phone_ext: req.body.phone_ext,
        password: req.body.password,
      })

      res.cookie('accessToken', tokens.accessToken, {
        maxAge: 300000, // 5 minutes
        httpOnly: true,
      })

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
      })

      refreshTokens.push(tokens.refreshToken)

      res.header('auth-token', tokens.accessToken).status(201).json({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user: tokens.user,
        status: 201,
      })
    } catch (e) {
      console.log(e)
      res.status(201).send({
        status: 201,
      })
    }
  } catch (err) {
    try {
      session.endSession()
    } catch (e) {
      console.log(e)
    }

    next(err)
  }
}

const _login = async (req, res, next) => {
  try {
    const tokens = await login(req.query)

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 300000, // 5 minutes
      httpOnly: true,
    })
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
    })

    refreshTokens.push(tokens.refreshToken)
    res.header('auth-token', tokens.accessToken).status(200).json({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      status: 200,
    })
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
    res.status(200).json({ access_token: accessToken, status: 200 })
  })
}

const _logout = (req, res) => {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  })
  res.cookie('refreshToken', '', {
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

import express from 'express'
import dotenv from 'dotenv'

import debug from '../utils/logger.js'
import { authArea } from '../middleware/auth.middleware.js'

dotenv.config({ path: './.env' })

const router = express.Router()

router.get('/token', async (req, res, next) => {
  try {
    const token = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':', 'utf-8')
    console.log(token.toString('base64'))
    res.status(201).send({ token: token.toString('base64') })
  } catch (err) {
    next(err)
  }
})

export default router

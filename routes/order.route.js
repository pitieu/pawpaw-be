import express from 'express'

import debug from '../utils/logger.js'

import { createOrder } from '../controller/order.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', authArea, async (req, res, next) => {
  try {
    if (!req.body.serviceId)
      throw { error: 'ServiceId is required', status: 400 }

    const order = await createOrder(req.body, req.user._id)
    res
      .status(201)
      .send({ message: 'Order successfully created', _id: order._id })
  } catch (err) {
    next(err)
  }
})

export default router

import express from 'express'

import debug from '../utils/logger.js'

import { createOrder } from '../controller/order.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'

const router = express.Router()

const _createOrder = async (req, res, next) => {
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
}

router.post('/', authArea, _createOrder)

export default router

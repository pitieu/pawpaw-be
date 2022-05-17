import express from 'express'

import debug from '../utils/logger.js'

import { createOrder, approveOrder } from '../controller/order.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'

const router = express.Router()

const _createOrder = async (req, res, next) => {
  try {
    if (!req.body.serviceId)
      throw { error: 'ServiceId is required', status: 400 }

    const order = await createOrder(req.body, req.user._id)

    res
      .status(201)
      .send({ message: 'Order successfully created', orderId: order.orderId })
  } catch (err) {
    next(err)
  }
}
const _approveOrder = async (req, res, next) => {
  try {
    const order = await approveOrder(req.params.orderId, req.user._id)
    res.status(200).send({ message: 'Order approved sucessfully' })
  } catch (err) {
    next(err)
  }
}

router.post('/', authArea, _createOrder)
router.post('/:orderId/approve', authArea, _approveOrder)

export default router

import express from 'express'
import debug from '../utils/logger.js'

import {
  createOrder,
  approveOrder,
  completeOrder,
} from '../controller/order.ctrl.js'
import { refund } from '../controller/payment.ctrl.js'
import * as AuthMiddleware from '../middleware/auth.middleware.js'
import { handleErrors } from '../middleware/error.middleware.js'
import { badRequestError } from '../utils/error.utils.js'

const router = express.Router()

router.use(AuthMiddleware.initialize)
router.use(AuthMiddleware.session)

router.post('/', AuthMiddleware.authArea, createOrderHandler)
router.post('/:order_id/approve', AuthMiddleware.authArea, approveOrderHandler)
router.post(
  '/:order_id/complete',
  AuthMiddleware.authArea,
  completeOrderHandler,
)
router.post('/:order_id/refund', AuthMiddleware.authArea, refundCustomerHandler)

const createOrderHandler = async (req, res, next) => {
  try {
    if (!req.body.service_id)
      throw new badRequestError('Service id is required')

    const order = await createOrder(req.body, req.user._id)

    res.status(201).send({
      message: 'order created successfully',
      order_id: order.order_id,
      status: 201,
    })
  } catch (err) {
    next(err)
  }
}

const approveOrderHandler = async (req, res, next) => {
  try {
    const order = await approveOrder(
      req.params.order_id,
      req.query.approve,
      req.user._id,
      req.query.cancel_reason,
    )
    res.json({ message: 'order approved successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

const completeOrderHandler = async (req, res, next) => {
  try {
    const response = await completeOrder(req.params.order_id)

    res.json({ message: 'order completed successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

const refundCustomerHandler = async (req, res, next) => {
  try {
    const response = await refund(req.params.order_id, req.user._id)

    res.json({ message: 'refund processing shortly', status: 200 })
  } catch (err) {
    next(err)
  }
}

export default router

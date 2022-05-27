import express from 'express'

import debug from '../utils/logger.js'

import {
  createOrder,
  approveOrder,
  completeOrder,
} from '../controller/order.ctrl.js'
import { refund } from '../controller/payment.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'

const router = express.Router()

const _createOrder = async (req, res, next) => {
  try {
    if (!req.body.service_id)
      throw { error: 'service_id is required', status: 400 }

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

const _approveOrder = async (req, res, next) => {
  try {
    const order = await approveOrder(
      req.params.order_id,
      req.query.approve,
      req.user._id,
      req.query.cancel_reason,
    )
    res.status(200).send({ message: 'order approved sucessfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

const _completeOrder = async (req, res, next) => {
  try {
    const response = await completeOrder(req.params.order_id)

    res
      .status(200)
      .send({ message: 'order completed successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

const _refundCustomer = async (req, res, next) => {
  try {
    const response = await refund(req.params.order_id, req.user._id)

    res.status(200).send({ message: 'refund processing shortly', status: 200 })
  } catch (err) {
    next(err)
  }
}

router.post('/', authArea, _createOrder)
router.post('/:order_id/approve', authArea, _approveOrder)
router.post('/:order_id/complete', authArea, _completeOrder)
router.post('/:order_id/refund', authArea, _refundCustomer)

export default router

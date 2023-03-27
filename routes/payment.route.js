import express from 'express'
import dotenv from 'dotenv'

import debug from '../utils/logger.js'
import { badRequestError, internalServerError } from '../utils/error.utils.js'

import {
  addPaymentNotification,
  checkStatus,
  requestNewPayment,
  cancelPayment,
} from '../controller/payment.ctrl.js'
import { updateOrderStatus } from '../controller/order.ctrl.js'

import * as AuthMiddleware from '../middleware/auth.middleware.js'

dotenv.config({ path: './.env' })

const router = express.Router()

router.use(AuthMiddleware.initialize)
router.use(AuthMiddleware.session)

if (process.env.NODEJS_ENV == 'development') {
  router.get('/order/:order_id/status', checkStatusHandler)
  router.post('/order/:order_id/cancel', cancelPaymentHandler)
}
router.get('/token', getMidtransTokenHandler)
router.post('/notifications/payment', paymentNotificationHandler)
router.post('/notifications/recurring', recurringHandler)
router.post('/notifications/payaccount', payaccountHandler)
router.post('/notifications/redirect', okHandler)
router.post('/notifications/unfinishedredirect', okHandler)
router.post('/notifications/error', okHandler)
router.post(
  '/order/:order_id',
  AuthMiddleware.authArea,
  requestNewPaymentHandler,
)

// TODO - this whole code is only used for now to test the payment flow
// Will be replaced with the payment gateway

const getMidtransTokenHandler = async (req, res, next) => {
  try {
    const token = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':', 'utf-8')
    res.status(201).send({ token: token.toString('base64') })
  } catch (err) {
    next(err)
  }
}

const paymentNotificationHandler = async (req, res, next) => {
  try {
    // const verifySignature =
    //   req.body.order_id +
    //   req.body.status_code +
    //   req.body.gross_amount +
    //   process.env.MIDTRANS_SERVER_KEY

    // const hash = crypto
    //   .createHash('sha256')
    //   .update(verifySignature)
    //   .digest('hex')

    // if (hash != req.body.signature_key) {
    //   throw { error: 'Signature does not match', status: 400 }
    // }

    const status = await checkStatus(req.body.order_id)
    if (
      status.order_id !== req.body.order_id ||
      status.gross_amount !== req.body.gross_amount ||
      status.transaction_id !== req.body.transaction_id ||
      status.fraud_status !== req.body.fraud_status ||
      status.signature_key !== req.body.signature_key ||
      status.transaction_status !== req.body.transaction_status
    ) {
      throw new badRequestError('Something went wrong')
    }

    await addPaymentNotification(req.body)
    try {
      if (req.body.status_code !== '200') {
        throw new internalServerError(req.body.status_message)
      }
      const order = await updateOrderStatus(req.body)
    } catch (e) {
      throw new internalServerError('Failed update order status')
    }
    // should always send 200 saying it received the notification from midtrans
    res.status(200).send()
  } catch (err) {
    next(err)
  }
}

const recurringHandler = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const payaccountHandler = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const okHandler = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const checkStatusHandler = async (req, res, next) => {
  try {
    const status = await checkStatus(req.params.order_id)
    res.status(200).send(status)
  } catch (e) {
    next(e)
  }
}

const cancelPaymentHandler = async (req, res, next) => {
  try {
    const status = await cancelPayment(req.params.order_id)
    res.status(200).send(status)
  } catch (e) {
    next(e)
  }
}

const requestNewPaymentHandler = async (req, res, next) => {
  try {
    req.body.customer = req.user
    const payment = await requestNewPayment(
      req.params.order_id,
      req.body,
      req.user._id,
    )
    res.status(200).send({
      message: 'new payment requested successfully',
      status: 200,
    })
  } catch (e) {
    next(e)
  }
}

export default router

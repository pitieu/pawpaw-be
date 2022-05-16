import express from 'express'
import dotenv from 'dotenv'
import crypto from 'crypto'

import debug from '../utils/logger.js'
import { authArea } from '../middleware/auth.middleware.js'
import {
  addPaymentNotification,
  checkStatus,
} from '../controller/payment.ctrl.js'
import { updateOrderStatus } from '../controller/order.ctrl.js'

dotenv.config({ path: './.env' })

const router = express.Router()

const _getMidtransToken = async (req, res, next) => {
  try {
    const token = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':', 'utf-8')
    console.log(token.toString('base64'))
    res.status(201).send({ token: token.toString('base64') })
  } catch (err) {
    next(err)
  }
}

const _paymentNotification = async (req, res, next) => {
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

    // const status = await checkStatus(req.body.order_id)
    // if (
    //   status.order_id !== req.body.order_id ||
    //   status.gross_amount !== req.body.gross_amount ||
    //   status.transaction_id !== req.body.transaction_id ||
    //   status.fraud_status !== req.body.fraud_status ||
    //   status.signature_key !== req.body.signature_key ||
    //   status.transaction_status !== req.body.transaction_status
    // ) {
    //   throw { error: 'Some fields do not match with midtrans', status: 400 }
    // }

    await addPaymentNotification(req.body)
    try {
      if (req.body.status_code !== '200') {
        throw { error: req.body.status_message, status: 400 }
      }
      // await updateOrderStatus(req.body)
    } catch (e) {
      debug.error('Failed update order status')
      console.log(e)
    }
    // should always send 200 saying it received the notification from midtrans
    res.status(200).send()
  } catch (err) {
    debug.error(req.body)
    next(err)
  }
}

const _recurring = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const _payaccount = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const _ok = (req, res, next) => {
  debug.info(req.body)
  res.status(200).send()
}

const _checkStatus = async (req, res, next) => {
  const status = await checkStatus(req.params.orderId)
  debug.info(status)
  res.status(200).send(status)
}
if (process.env.NODEJS_ENV == 'development') {
  router.get('/:orderId/status', _checkStatus)
}
router.get('/token', _getMidtransToken)
router.post('/notifications/payment', _paymentNotification)
router.post('/notifications/recurring', _recurring)
router.post('/notifications/payaccount', _payaccount)
router.post('/notifications/redirect', _ok)
router.post('/notifications/unfinishedredirect', _ok)
router.post('/notifications/error', _ok)
export default router

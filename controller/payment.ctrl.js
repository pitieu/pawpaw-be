import axios from 'axios'

import debug from '../utils/logger.js'
import Payment from '../model/Payment.model.js'
import PaymentNotification from '../model/PaymentNotification.model.js'
import Order from '../model/Order.model.js'
import { fetchOrder } from './order.ctrl.js'

export const createPaymentRequest = async (cost, orderId, data) => {
  const response = await sendPaymentRequest(cost, orderId, data)
  // debug.info(response)
  if (!response) {
    throw { error: 'Failed to create payment request' }
  }
  const paymentData = new Payment(response)
  const savedData = await paymentData.save()
  return savedData
}

export const queryPaymentGateway = (url, method, data = {}) => {
  const username = process.env.MIDTRANS_SERVER_KEY
  const password = ''

  const encodedBase64Token = Buffer.from(`${username}:${password}`).toString(
    'base64',
  )

  const authorization = `Basic ${encodedBase64Token}`
  return axios({
    url: url,
    method: method,
    headers: {
      Authorization: authorization,
    },
    data: data,
  })
}

export const checkStatus = (orderId) => {
  const url = process.env.MIDTRANS_API_URL_V2 + orderId + '/status'

  return queryPaymentGateway(url, 'get').then((res) => res.data)
}

export const sendPaymentRequest = async (cost, orderId, data) => {
  if (
    [
      // 'credit_card',
      'bank_transfer', // contain most internet banking payment options
      'echannel',
      'bca_klikpay',
      'bca_klikbca',
      'bri_epay',
      'cimb_clicks',
      'danamon_online',
      // 'uob_ezpay',
      'qris',
      'gopay',
      'shopeepay',
      'cstore',
    ].indexOf(data.payment.type) < 0
  ) {
    throw {
      error: 'Payment method "' + data.payment.type + '"not allowed',
      status: 400,
    }
  }

  let axiosData = {
    payment_type: data.payment.type,
    transaction_details: {
      order_id: orderId,
      gross_amount: cost,
    },
  }

  if (data.payment.type === 'credit_card') {
    throw { error: 'Credit Card not implemented yet', status: 400 }
  }
  // Mandiri's virtual account
  if (data.payment.type === 'echannel') {
    axiosData.echannel = data.payment.echannel
  }
  // Virtual accounts
  if (data.payment.type === 'bank_transfer') {
    if (['permata', 'bca', 'bni', 'bri'].indexOf(data.payment.bank) < 0) {
      throw { error: 'Invalid bank in payment', status: 400 }
    }
    let va = data.customer.phone
    if (data.payment.bank === 'permata') {
      // size va must be 10
      va = va.substr(va.length - 10, va.length)
      axiosData.bank_transfer = {
        bank: data.payment.bank,
        permata: {
          recipient_name: 'PawPaw',
        },
      }
    }

    if (data.payment.bank === 'bca') {
      // size va 1-11
      va = va.substr(va.length - 11, va.length)
      axiosData.bank_transfer = {
        bank: data.payment.bank,
        va_number: va,
      }
    }
    if (data.payment.bank === 'bni') {
      // size va 1-8
      va = va.substr(va.length - 8, va.length)
      axiosData.bank_transfer = {
        bank: data.payment.bank,
        va_number: va,
      }
    }
    if (data.payment.bank === 'bri') {
      // size va 1-13
      va = va.substr(va.length - 13, va.length)
      axiosData.bank_transfer = {
        bank: data.payment.bank,
        va_number: va,
      }
    }
  }
  if (data.payment.type === 'bca_klikpay') {
    axiosData.bca_klikpay = data.payment.bca_klikpay
  }
  if (data.payment.type === 'bca_klikbca') {
    axiosData.bca_klikbca = data.payment.bca_klikbca
  }
  if (data.payment.type === 'cimb_clicks') {
    axiosData.cimb_clicks = data.payment.cimb_clicks
  }
  if (data.payment.type === 'qris') {
    axiosData.qris = data.payment.qris
  }
  if (data.payment.type === 'gopay') {
    axiosData.gopay = {
      enable_callback: true,
      callback_url: 'someapps://callback',
    }
  }
  if (data.payment.type === 'shopeepay') {
    axiosData.shopeepay = {
      callback_url: 'https://midtrans.com/',
    }
  }
  // alfamart, indomaret
  if (data.payment.type === 'cstore') {
    if (['Indomaret', 'alfamart'].indexOf(data.payment.store) < 0) {
      throw { error: "Only 'Indomaret' and 'alfamart' allowed", status: 400 }
    }
    axiosData.cstore.store = data.payment.store
    // potentially add message field for indomaret to appear in POS and
    // alfamart_free_text_1 alfamart_free_text_2 alfamart_free_text_3 fields for alfamart
    // where it would appear in printed receipt
  }
  console.log(axiosData)
  const url = process.env.MIDTRANS_API_URL_V2 + 'charge'
  return queryPaymentGateway(url, 'post', axiosData).then((res) => res.data)
}

export const addPaymentNotification = async (data) => {
  const paymentData = new PaymentNotification(data)
  return await paymentData.save()
}

export const cancelPayment = async (orderId) => {
  const url = process.env.MIDTRANS_API_URL_V2 + orderId + '/cancel'

  const response = await queryPaymentGateway(url, 'post').then(
    (res) => res.data,
  )
  const paymentData = new Payment(response)
  const newPayment = await paymentData.save()

  if (response.status_code != '200') {
    throw { error: response.status_message, status: 400 }
  }

  const update = await Order.updateOne(
    { orderId: orderId, status: 'pending' },
    { 'payment.status': 'canceled' },
    { new: true },
  )
  return update
}

export const requestNewPayment = async (orderId, payment, customerId) => {
  const order = await fetchOrder({ orderId: orderId, customerId: customerId })
  if (!order) {
    throw { error: 'Could not find order', status: 400 }
  }
  try {
    await cancelPayment(orderId)
  } catch (e) {
    debug.error(e)
  }
  const response = await sendPaymentRequest(
    order.totalCost,
    order.orderId,
    payment,
  )
  if (response.status_code == '200' || response.status_code == '201') {
    const paymentData = new Payment(response)
    const newPayment = await paymentData.save()
    return Order.updateOne(
      { orderId: orderId, status: 'pending', customerId: customerId },
      {
        'payment.status': 'pending',
        'payment.paymentId': response.transaction_id,
      },
      { new: true },
    )
  }
  throw { error: response.status_message, status: 400 }
}

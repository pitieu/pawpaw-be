import axios from 'axios'

import Payment from '../model/Payment.model.js'

export const createPaymentRequest = async (cost, orderId, data) => {
  const response = await sendPaymentRequest(cost, orderId, data)
  const paymentData = new Payment(response.data)
  const savedData = await paymentData.save()
  console.log(savedData)
  return savedData
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

  const url = process.env.MIDTRANS_API_URL_V2 + 'charge'

  //   console.log(url, header)
  const username = process.env.MIDTRANS_SERVER_KEY
  const password = ''

  const encodedBase64Token = Buffer.from(`${username}:${password}`).toString(
    'base64',
  )

  const authorization = `Basic ${encodedBase64Token}`
  console.log(url, authorization)
  console.log(axiosData)

  return axios({
    url: url,
    method: 'post',
    headers: {
      Authorization: authorization,
    },
    data: axiosData,
  })
}

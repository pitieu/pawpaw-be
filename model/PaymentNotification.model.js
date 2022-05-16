import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const paymentNotificationSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false },
)
paymentNotificationSchema.plugin(uniqueValidator)

const PaymentNotification = mongoose.model(
  'PaymentNotification',
  paymentNotificationSchema,
)

export default PaymentNotification

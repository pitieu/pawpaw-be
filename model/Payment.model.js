import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const paymentSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false },
)
paymentSchema.plugin(uniqueValidator)

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment

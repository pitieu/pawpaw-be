import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const product = {
  productId: { type: String },
  price: { type: Number },
  amount: { type: Number },
}

export const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    // service seller
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    paymentId: { type: String },
    conversationId: { type: String },
    status: {
      type: String,
      enum: [
        'pending', // this status means it's waiting for payment
        'paid', // this status means it's waiting for acceptance of service provider
        'accepted', // this status means it's waiting for processing of service
        'completed', // this status means the order was completed
        'canceled', // this status means the order got canceled
        'failed', // this status means the order failed to be executed due to dispute ?
      ],
    },
    platformFee: { type: Number },
    platformFeeType: { type: String, enum: ['percent', 'fixed'] },
    platformCost: { type: Number },
    transportCost: { type: Number },
    productsCost: { type: Number },
    addonsCost: { type: Number },
    totalCost: { type: Number },

    canceledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    canceledAt: { type: String },

    bookingPeriod: {
      start: { type: Date },
      end: { type: Date },
    },
    deliveryAddress: { type: [Number], index: '2d' },
    notes: { type: String },
    products: [product],
    productAddons: [product],
  },
  { timestamps: true },
)

orderSchema.plugin(uniqueValidator)

const Order = mongoose.model('Order', orderSchema)

export default Order

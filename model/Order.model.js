import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const product = {
  productId: { type: String },
  price: { type: Number },
  amount: { type: Number },
}

export const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
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
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'canceled', 'expired', 'failed'],
        required: true,
      },
      statusReason: { type: String, default: '' },
      paymentId: { type: String, required: true },
    },
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
      required: true,
    },
    statusReason: { type: String, default: '' },
    platformFee: { type: Number, default: 2.5 },
    platformFeeType: {
      type: String,
      enum: ['percent', 'fixed'],
      default: 'percent',
    },
    platformCost: { type: Number, required: true },
    transportCost: { type: Number, required: true },
    productsCost: { type: Number, required: true },
    addonsCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },

    canceledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    canceledAt: { type: String },

    bookingPeriod: {
      start: { type: Date }, // used for timeframe: one_start_end_date_time
      end: { type: Date }, // used for timeframe: one_start_end_date_time
      dates: [{ type: Date }], // used for timeframe: multi_date_time
      dateTime: { type: Date }, // used for timeframe: one_date_time
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

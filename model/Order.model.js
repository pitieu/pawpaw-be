import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const product = {
  product_id: { type: String },
  price: { type: Number },
  amount: { type: Number },
}

export const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, unique: true, required: true },
    // service seller
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    payment: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'canceled', 'expired', 'failed'],
        required: true,
      },
      status_reason: { type: String, default: '' },
      payment_id: { type: String, required: true },
    },
    conversation_id: { type: String },
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
    status_reason: { type: String, default: '' },
    platform_fee: { type: Number, default: 2.5 },
    platform_fee_type: {
      type: String,
      enum: ['percent', 'fixed'],
      default: 'percent',
    },
    platform_cost: { type: Number, required: true },
    transport_cost: { type: Number, required: true },
    products_cost: { type: Number, required: true },
    addons_cost: { type: Number, required: true },
    total_cost: { type: Number, required: true },

    cancel_reason: { type: String },
    canceled_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    canceled_at: { type: String },

    booking_period: {
      start: { type: Date }, // used for timeframe: one_start_end_date_time
      end: { type: Date }, // used for timeframe: one_start_end_date_time
      dates: [{ type: Date }], // used for timeframe: multi_date_time
      date_time: { type: Date }, // used for timeframe: one_date_time
    },
    delivery_address: { type: [Number], index: '2d' },
    notes: { type: String },
    products: [product],
    product_addons: [product],
  },
  { timestamps: true },
)

orderSchema.plugin(uniqueValidator)

const Order = mongoose.model('Order', orderSchema)

export default Order

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
    conversation_id: { type: String },
    payment: {
      // customer paying status
      status: {
        type: String,
        enum: [
          'pending',
          'paid',
          'canceled',
          'expired',
          'failed',
          'refunding',
          'refunded',
        ],
        required: true,
      },
      status_reason: { type: String, default: '' },
      payment_id: { type: String, required: true },
    },
    payment_merchant: {
      // merchant receiving money status
      status: {
        type: String,
        enum: [
          'pending',
          'paid',
          'canceled',
          'expired',
          'failed',
          'refunding',
          'refunded',
        ],
      },
      status_reason: { type: String, default: '' },
      payment_id: { type: String },
      withdraw_allowed_after: { type: Date },
    },
    status: {
      type: String,
      enum: [
        'pending', // waiting for payment from customer
        'paid', // waiting for acceptance/refusal of service provider
        'accepted', // waiting for processing of service or customer completing
        'pay_merchant', // order completed by customer/system but is waiting for merchant to be paid to fully complete
        'completed', // order fully completed
        'canceled', // order canceled
        'failed', // order failed to be executed due to dispute? or other issue
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

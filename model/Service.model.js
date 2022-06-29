import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const photo = {
  primary: { type: Boolean },
  filename: { type: String },
  data: { type: Buffer },
  content_type: { type: String },
}

// const reviews = {
//   reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   reviewText: { type: String },
//   photos: [photos],
//   parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
//   children: [reviewId],
// }

// const prices = {
//   price: { type: Number },
//   amount: {
//     // amount of animals or animal weight in kg
//     min: { type: Number },
//     max: { type: Number },
//   },
// }

const product = {
  name: { type: String },
  description: { type: String },
  price: { type: Number },

  weight: {
    start: { type: Number },
    end: { type: Number },
  },
  weightSelected: { type: Boolean },

  time: { type: String },
  timeSelected: { type: Boolean },

  booking_period: {
    start: { type: String },
    end: { type: String },
  },
  selectable: { type: Boolean },
}

export const serviceSchema = new mongoose.Schema(
  {
    user_id: {
      //owner of the service
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    // location: { type: [Number], index: '2d' },
    photos: [photo],
    // rating: [ratings],
    // reviews: [reviews],
    // like: { type: Boolean }, // todo: move it to it's own table
    products: [product],
    product_addons: [product],
    price_per_km: { type: Number }, // transportation cost per km
    opening_hours: {
      mon: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      tue: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      wed: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      thu: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      fri: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sat: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sun: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
    },
    negotiable_hours: { type: Boolean }, // negotiable Opening / Closing hours
    negotiable_hours_rate: { type: Number }, // price per additional hour over the open/close time
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)
serviceSchema.plugin(uniqueValidator)

const Service = mongoose.model('Service', serviceSchema)

export default Service

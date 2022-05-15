import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const photo = {
  filename: { type: String },
  data: { type: Buffer },
  contentType: { type: String },
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

  // order: {type: Number},
  // default: {type: Boolean},

  bookingPeriod: {
    start: { type: String },
    end: { type: String },
  },
  selectable: { type: Boolean },
}

export const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
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
    productAddons: [product],
    pricePerKm: { type: Number }, // transportation cost per km
    openingHours: {
      mon: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      tue: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      wed: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      thu: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      fri: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sat: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sun: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
    },
    negotiableHours: { type: Boolean }, // negotiable Opening / Closing hours
    negotiableHoursRate: { type: Number }, // price per additional hour over the open/close time
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)
serviceSchema.plugin(uniqueValidator)

const Service = mongoose.model('Service', serviceSchema)

export default Service

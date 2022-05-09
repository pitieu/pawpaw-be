import mongoose from 'mongoose'

const photos = {
  photoProfile: { type: String },
  type: { type: Number }, // 0 photo, 1 video
}

const reviews = {
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewText: { type: String },
  photos: [photos],
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  children: [reviewId],
}

const prices = {
  price: { type: Number },
  amount: {
    // amount of animals or animal weight in kg
    min: { type: Number },
    max: { type: Number },
  },
}

const product = {
  text: { type: String },
  description: { type: String },
  price: [prices],

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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    name: { type: String },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    // location: { type: [Number], index: '2d' },
    photos: [photos],
    // rating: [ratings],
    // reviews: [reviews],
    // like: { type: Boolean }, // todo: move it to it's own table
    products: [product],
    productAddons: [product],
    pricePerKm: { type: Number }, // transportation cost per km

    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: String },
    deleted: { type: Boolean },
  },
  { timestamps: true },
)

const Service = mongoose.model('Service', serviceSchema)

export default Service

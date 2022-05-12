import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 0, max: 5 },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  },
  { timestamps: true },
)

const Rating = mongoose.model('Rating', ratingSchema)

export default Rating

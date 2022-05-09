import mongoose from 'mongoose'

const rating = {
  rating: { type: Number, min: 0, max: 5 },
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}

export const serviceReviewSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, min: 0, max: 5 },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },

    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    photos: [photos],
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceReview' }],
  },
  { timestamps: true },
)

const ServiceReview = mongoose.model('ServiceReview', serviceReviewSchema)

export default ServiceReview

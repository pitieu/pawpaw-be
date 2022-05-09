import mongoose from 'mongoose'

export const productReviewSchema = new mongoose.Schema(
  {
    productId: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
)

const ProductReview = mongoose.model('ProductReview', productReviewSchema)

export default ProductReview

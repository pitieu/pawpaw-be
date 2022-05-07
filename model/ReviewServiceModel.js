import mongoose from 'mongoose'

export const productServiceSchema = new mongoose.Schema(
  {
    serviceId: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
)

const ProductService = mongoose.model('ReviewService', productServiceSchema)

export default ProductService

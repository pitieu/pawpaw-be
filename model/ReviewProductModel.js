import mongoose from 'mongoose'

export const productProductSchema = new mongoose.Schema(
  {
    productId: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
)

const ProductProduct = mongoose.model('ReviewProduct', productProductSchema)

export default ProductProduct

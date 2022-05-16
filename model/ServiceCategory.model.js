import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    key: { type: String, required: true, unique: true },
    platformFee: { type: Number, required: true, default: 2 },
    platformFeeType: {
      type: String,
      required: true,
      enum: ['percent', 'fixed'],
    },
    timeframe: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)
serviceCategorySchema.plugin(uniqueValidator)

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema)

export default ServiceCategory

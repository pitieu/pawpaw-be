import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    key: { type: String, required: true, unique: true },
    platform_fee: { type: Number, required: true, default: 2 },
    platform_fee_type: {
      type: String,
      required: true,
      enum: ['percent', 'fixed'],
    },
    timeframe: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date },
  },
  { timestamps: true },
)
serviceCategorySchema.plugin(uniqueValidator)

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema)

export default ServiceCategory

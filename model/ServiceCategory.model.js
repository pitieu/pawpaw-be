import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    key: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)
serviceCategorySchema.plugin(uniqueValidator)

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema)

export default ServiceCategory

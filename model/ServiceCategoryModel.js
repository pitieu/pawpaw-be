import mongoose from 'mongoose'

export const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
  },
  { timestamps: true },
)

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema)

export default ServiceCategory

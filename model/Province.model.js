import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const provinceSchema = new mongoose.Schema(
  {
    province_code: { type: String },
    province_name: { type: String },
    province_name_en: { type: String },
  },
  { timestamps: true },
)
provinceSchema.plugin(uniqueValidator)

const Province = mongoose.model('Province', provinceSchema)

export default Province

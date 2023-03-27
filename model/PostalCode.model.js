import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const postalCodeSchema = new mongoose.Schema(
  {
    urban: { type: String, index: 1 },
    sub_district: { type: String, index: 1 },
    city: { type: String, index: 1 },
    province_code: { type: String },
    province_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    postal_code: { type: String },
  },
  { timestamps: true },
)
postalCodeSchema.plugin(uniqueValidator)

postalCodeSchema.index({
  sub_district: 'text',
  urban: 'text',
  city: 'text',
})

const PostalCode = mongoose.model('PostalCode', postalCodeSchema)

export default PostalCode

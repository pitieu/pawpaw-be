import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const accountSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    full_name: { type: String },
    username: { type: String, lowercase: true, unique: true, required: true },
    website: { type: String, lowercase: true },
    biography: { type: String },
    gender: { type: Number }, // 0 male, 1 female, 2 others
    birth_date: { type: Date },
    location: { type: String },
    profile_photo: {
      filename: { type: String },
      data: { type: Buffer },
      content_type: { type: String },
    },
    geo: { type: [Number], index: '2d' }, // geolocation long,lat
    deleted: { type: Boolean, default: false },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date },
    deleted_reason: { type: String },
    bank_details: {
      full_name: { type: String },
      account: { type: String },
      bank_code: { type: String },
    },
  },
  { timestamps: true },
)
accountSchema.plugin(uniqueValidator)

const Account = mongoose.model('Account', accountSchema)

export default Account

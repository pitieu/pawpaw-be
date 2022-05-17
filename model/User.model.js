import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    username: { type: String },
    password: { type: String },
    website: { type: String },
    biography: { type: String },
    gender: { type: Number }, //0 male, 1 female, 2 others
    location: { type: String },
    phone: { type: String, required: true },
    phone_ext: { type: String, required: true },
    email: { type: String, lowercase: true },
    profile_photo: {
      filename: { type: String },
      data: { type: Buffer },
      content_type: { type: String },
    },
    geo: { type: [Number], index: '2d' }, // geolocation long,lat
    phone_validated: { type: Boolean },
    deleted: { type: Boolean, default: false },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date },
    deleted_reason: { type: String },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User

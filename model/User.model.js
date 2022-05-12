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
    phoneExt: { type: String, required: true },
    email: { type: String, lowercase: true },
    profilePhoto: {
      data: Buffer,
      contentType: String,
    },
    geo: { type: [Number], index: '2d' }, // geolocation long,lat
    phoneValidated: { type: Boolean },
    deleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    deleteReason: { type: String },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User

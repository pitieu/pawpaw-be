import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    username: { type: String },
    password: { type: String },
    website: { type: String },
    biography: { type: String },
    gender: { type: Number },//0 male, 1 female, 2 others
    location: { type: String },
    phone: { type: String, required: true },
    phoneExt: { type: String, required: true },
    email: { type: String, lowercase: true },
    profilePhoto: { type: String, default: '' },
    geo: {type: [Number], index: '2d'},// geolocation long,lat
    phoneValidated: {type: Boolean }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;

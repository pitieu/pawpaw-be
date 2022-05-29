import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Todo: fix phone number is not unique but phone+phone_ext is
export const userSchema = new mongoose.Schema(
  {
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    phone_ext: { type: String, required: true },
    email: { type: String, lowercase: true },
    phone_validated: { type: Boolean, default: false },
    email_validated: { type: Boolean, default: false },
    selected_account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    deleted: { type: Boolean, default: false },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date },
    deleted_reason: { type: String },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

userSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}
userSchema.methods.comparePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password)
}

const User = mongoose.model('User', userSchema)

export default User

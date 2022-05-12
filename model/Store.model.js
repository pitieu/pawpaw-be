import mongoose from 'mongoose'

export const storeSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    photo: {
      filename: String,
      data: Buffer,
      contentType: String,
    },
    // reviews: [reviews],
    location: { type: [Number], index: '2dsphere' },
    open: { type: Boolean },
    reopenDate: { type: Date },
    // dates where the business is unavailable
    // this could be through order or manual input.
    unavailable: [{ type: Date }],
    deleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)

const Store = mongoose.model('Store', storeSchema)

export default Store

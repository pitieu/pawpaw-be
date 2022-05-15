import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

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
    openingHours: {
      mon: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      tue: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      wed: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      thu: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      fri: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sat: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sun: {
        openingHour: { type: Number, min: 0, max: 23, default: 8 },
        closingHour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
    },
    negotiableHours: { type: Boolean }, // negotiable Opening / Closing hours
    negotiableHoursRate: { type: Number }, // price per additional hour over the open/close time
    // dates where the business is unavailable
    // this could be through order or manual input.
    unavailable: [{ type: Date }],
    deleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
  },
  { timestamps: true },
)
storeSchema.plugin(uniqueValidator)

const Store = mongoose.model('Store', storeSchema)

export default Store

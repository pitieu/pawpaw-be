import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export const storeSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    open: { type: Boolean },
    reopen_date: { type: Date },
    opening_hours: {
      mon: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      tue: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      wed: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      thu: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      fri: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sat: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
      sun: {
        opening_hour: { type: Number, min: 0, max: 23, default: 8 },
        closing_hour: { type: Number, min: 0, max: 23, default: 18 },
        open: { type: Boolean, default: true },
      },
    },
    negotiable_hours: { type: Boolean, default: true }, // negotiable Opening / Closing hours
    negotiable_hours_rate: { type: Number, default: 0 }, // price per additional hour over the open/close time
    // dates where the business is unavailable
    // this could be through order or manual input.
    unavailable: [{ type: Date }],
    deleted: { type: Boolean, default: false },
    deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleted_at: { type: Date },
  },
  { timestamps: true },
)
storeSchema.plugin(uniqueValidator)

const Store = mongoose.model('Store', storeSchema)

export default Store

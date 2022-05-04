const mongoose = require('mongoose');

const reviews = {
    reviewerId: { type: reviewId },
    reviewText: { type: String },
    photos: [ photos ],
    parentId: { type: reviewId },
    children: [ reviewId ]
}

const storeSchema = new mongoose.Schema(
  {
    userid: { type: userId },
    name: { type: String },
    photos: { type: String },
    reviews: [reviews],
    open: { type: Boolean },
    reopenDate: { type: String },
    // dates where the business is unavailable
    // this could be through order or manual input.
    unavailable: [dates]
  },
  { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

export default Store;

const mongoose = require('mongoose');
const reviewId = {};
const userId = {}
const ratings = {
    rating: { type: String },
}

const photos = {
    photoProfile: {type: String},
    type: {type: Number} // 0 photo, 1 video
}

const reviews = {
    reviewerId: { type: reviewId },
    reviewText: { type: String },
    photos: [photos],
    parentId: { type: reviewId },
    children: [ reviewId ]
}

const prices = {
    price: {type: Number},
    amount: {// amount of animals or animal weight in kg
        min: {type: Number},
        max: {type: Number}
    }
}

const product = {
    text: {type: String},
    description: {type: String},
    price: [prices],

    // order: {type: Number},
    // default: {type: Boolean},

    bookingPeriod: {
        start: { type: String },
        end: { type: String }
    },
    selectable: {type: Boolean},
}

const serviceSchema = new mongoose.Schema(
  {
    userId: {type: userId},
    name: { type: String },
    description: { type: String },
    location: { type: String },
    photos: [ photos ],
    rating: [ ratings ],
    reviews: [ reviews ],
    type: { type: Number }, // 0 Grooming, 1 Pet Sitting, 2 Pet Hotel, 3 Pet Walking, 4 Veterinarian, 5 Trainer
    like: { type: Boolean },// todo: move it to it's own table
    products: [product],
    // shampoo ??
    productAddons: [product],
    pricePerKm: {type: Number},// transportation cost per km
    deletedAt: { type: String },
    deleted: {type: Boolean}
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;

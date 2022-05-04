const mongoose = require('mongoose');

const product = {
    productId: { type: String },
    price: {type: Number}
}

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: Number },
    providerId: { type: Number },
    customerId: { type: Number },

    serviceId: { type: String },
    paymentId: {type: String},
    conversationId: { type: String },
    deliveryAddress: { type: String },
    
    status: { type: String }, // booked, paid, accepted, ongoing, completed, canceled, failed
    bookingOrder: {
        petsAmount: { type: Number },
        bookingPeriod: {
            start: { type: String },
            end: { type: String },
        },
        products: [product],
        productAddons: [product],
    },
    platformFee: { type: Number },
    transportCost: { type: Number },
    productsCost: { type: Number },
    addonsCost: { type: Number },
    totalPrice: { type: Number },

    canceledBy: { type: userId },
    canceledAt: { type: String }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

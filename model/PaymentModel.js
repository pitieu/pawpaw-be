const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    status: {type: String}
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

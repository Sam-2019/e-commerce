const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  method: {
    type: String,
  },
  status: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);

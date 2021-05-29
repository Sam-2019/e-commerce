const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  method: {
    type: String,
  },
  status: {
    type: String,
  },
  momo_name: {
    type: String,
  },
  momo_number: {
    type: Number,
  },
  momo_transaction_id: {
    type: Number,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);

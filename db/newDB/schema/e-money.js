const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EMoneySchema = new Schema({
  paymentID: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  transactionID: {
    type: String,
  },
});

module.exports = mongoose.model("EMoney", EMoneySchema);

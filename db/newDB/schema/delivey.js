const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  phone_number: {
    type: String,
  }
});

module.exports = mongoose.model("Delivery", DeliverySchema);

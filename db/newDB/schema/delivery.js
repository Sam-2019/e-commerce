const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  address: {
    type: String,
  },
  landmark: {
    type: String,
  },
});

module.exports = mongoose.model("Delivery", DeliverySchema);

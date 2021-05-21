const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderID: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: String,
  },
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);

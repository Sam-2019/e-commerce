const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
    },
    orderNumber: {
      type: String,
    },
    orderValue: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Order", OrderSchema);

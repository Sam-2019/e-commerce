const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productID: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    paymentID: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    deliveryID: {
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

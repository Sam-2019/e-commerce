const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  author: {
    type: String,
  },
  sku: {
    type: String,
  },
  price: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  quantity: {
    type: Number,
    min: 1,
  },
  detail: {
    type: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ProductSchema.index({ name: "text", author: "text", sku: "text" });

module.exports = mongoose.model("Product", ProductSchema);

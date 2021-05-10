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
    min: 0,
  },
  detail: {
    type: String,
  },
});

module.exports = mongoose.model("Product", ProductSchema);

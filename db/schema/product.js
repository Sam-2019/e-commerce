const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  sku: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Product", ProductSchema);

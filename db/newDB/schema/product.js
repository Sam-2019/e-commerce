const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  shortName: {
    type: String,
    lowercase: true,
  },
  price: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    min: 1,
  },
  author: {
    type: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ProductSchema.index({ name: "text", author: "text", shortName: "text" });

module.exports = mongoose.model("Product", ProductSchema);

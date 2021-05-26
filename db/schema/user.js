const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true
  },
  photoURL: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "WishList",
    },
  ],
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);

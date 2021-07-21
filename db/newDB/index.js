const ProductSchema = require("./schema/product");
const UserSchema = require("./schema/user");
const CartSchema = require("./schema/cart");
const OrderSchema = require("./schema/order");
const WishListSchema = require("./schema/wishlist");
const ReviewSchema = require("./schema/review");
const OrderItemSchema = require("./schema/orderItem");
const LocationSchema = require("./schema/location");
const PaymentSchema = require("./schema/payment");
const DeliverySchema = require("./schema/delivery");
const EMoneySchema = require("./schema/e-money");

const model = {
  ProductSchema,
  UserSchema,
  CartSchema,
  OrderSchema,
  WishListSchema,
  ReviewSchema,
  OrderItemSchema,
  LocationSchema,
  PaymentSchema,
  DeliverySchema,
  EMoneySchema,
};

module.exports = model;

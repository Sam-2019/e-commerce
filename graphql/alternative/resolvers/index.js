const user = require("./user");
const product = require("./product");
const cart = require("./cart");
const wishlist = require("./wishlist");
const order = require("./order");
const location = require("./location");
const search = require("./search");
const payment = require("./payment");
const emoney = require("./emoney");
const review = require("./review");
const delivery = require("./delivery");

const rootResolver = {
  ...user,
  ...product,
  ...cart,
  ...wishlist,
  ...order,
  ...review,
  ...location,
  ...search,
  ...payment,
  ...delivery,
  ...emoney,
};

module.exports = rootResolver;

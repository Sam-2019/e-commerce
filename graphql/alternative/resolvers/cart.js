const { CartSchema } = require("../../../db/newDB/index");

const getCarts = async () => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await CartSchema.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getUserCart = async ({ id }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await CartSchema.findById(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addProductToCart = async (
  { input: { userID, productID, quantity } },
  req
) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }
  const empty = productID && quantity;
  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const cart = new CartSchema({
    userID,
    productID,
    quantity,
  });

  try {
    const data = await cart.save();
    return {
      error: {
        message: "OK",
      },
      cart: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getCarts,
  getUserCart,
  addProductToCart,
};

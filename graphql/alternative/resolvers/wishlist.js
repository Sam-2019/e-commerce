const { WishListSchema } = require("../../../db/newDB/index");

const getWishLists = async ({ id }, req) => {
  try {
    const data = await WishListSchema.find(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getUserWishList = async ({ id }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await WishListSchema.findById(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addProductToWishList = async ({ input: { userID, productID } }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = userID && productID;

  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const wishlistData = new WishListSchema({
    userID,
    productID,
  });

  try {
    const data = await wishlistData.save();
    return {
      error: {
        message: "OK",
      },
      wishlist: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getWishLists,
  getUserWishList,
  addProductToWishList,
};

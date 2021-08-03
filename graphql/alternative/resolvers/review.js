const { ReviewSchema } = require("../../../db/newDB/index");

const getReviews = async () => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const products = await ProductSchema.find();
    return products;
  } catch (err) {
    console.log(err);
  }
};

const getProductReview = async ({ id }, req) => {
  try {
    const data = await ReviewSchema.find(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addReview = async (
  { input: { userID, productID, rating, review } },
  req
) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = userID && productID && rating && review;

  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const reviewData = new ReviewSchema({
    userID,
    productID,
    rating,
    review,
  });

  try {
    const data = await reviewData.save();
    console.log(data);
    return {
      error: {
        message: "OK",
      },
      review: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getReviews,
  getProductReview,
  addReview,
};

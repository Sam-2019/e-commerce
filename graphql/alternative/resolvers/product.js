const { ProductSchema } = require("../../../db/newDB/index");

const getProducts = async () => {
  try {
    const data = await ProductSchema.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addProduct = async (
  { input: { name, slug, price, imageURL, description, quantity, author } },
  req
) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = name && price && imageURL && author && slug && description;
  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const product = new ProductSchema({
    name,
    slug,
    price,
    imageURL,
    description,
    quantity,
    author,
  });

  try {
    const data = await product.save();
    return {
      error: {
        message: "Product successfully added",
      },
      product: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getProducts,
  addProduct,
};

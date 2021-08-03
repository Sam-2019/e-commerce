const { ProductSchema } = require("../../../db/newDB/index");

const search = async ({ id }, req) => {
  console.log(id);
  try {
    const data = await ProductSchema.findById(id);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  search,
};

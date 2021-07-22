const { DeliverySchema } = require("../../../db/newDB/index");

const getDeliveryLocations = async () => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await DeliverySchema.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addDelivery = async ({ input: { address, landmark } }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = address && landmark;
  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const Delivery = new DeliverySchema({
    address,
    landmark,
  });

  try {
    const data = await Delivery.save();
    return {
      error: {
        message: "OK",
      },
      delivery: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getDeliveryLocations,
  addDelivery,
};

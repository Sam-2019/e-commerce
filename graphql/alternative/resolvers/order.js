const { OrderSchema } = require("../../../db/newDB/index");

const getOrders = async () => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }
  try {
    const orders = await OrderSchema.find();
    return orders;
  } catch (err) {
    console.log(err);
  }
};

const getUserOrders = async ({ id }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await OrderSchema.findById(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addOrder = async (
  {
    input: {
      userID,
      productID,
      paymentID,
      deliveryID,
      orderNumber,
      orderValue,
    },
  },
  req
) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty =
    userID && productID && paymentID && deliveryID && orderNumber && orderValue;
  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const order = new OrderSchema({
    userID,
    productID,
    paymentID,
    deliveryID,
    orderNumber,
    orderValue,
    status: "PENDING",
  });

  try {
    const data = await order.save();
    return {
      error: {
        message: "OK",
      },
      order: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getOrders,
  getUserOrders,
  addOrder,
};

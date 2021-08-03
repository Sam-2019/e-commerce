const { PaymentSchema, EMoneySchema } = require("../../../db/newDB/index");

const getPayments = async () => {
  try {
    const data = await PaymentSchema.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const addPayment = async (
  { input: { method, status, phoneNumber, name, number, transactionID } },
  req
) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = method && status && phoneNumber;

  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const payment = new PaymentSchema({
    method,
    status,
    phoneNumber,
  });

  try {
    const data = await payment.save();

    if (data.method === "MobileMoney") {
      const emoney = new EMoneySchema({
        paymentID: data.id,
        name: "WERTYUI",
        number: 2345678,
        transactionID: "WERT4567RFGH67U8",
      });

      await emoney.save();
    }

    return {
      error: {
        message: "OK",
      },
      payment: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getPayments,
  addPayment,
};

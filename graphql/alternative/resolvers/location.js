const { LocationSchema } = require("../../../db/newDB/index");

const getLocations = async () => {
  try {
    const locations = await LocationSchema.find();
    return locations;
  } catch (err) {
    console.log(err);
  }
};

const addLocation = async ({ input: { name, fee } }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  const empty = name && fee;

  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const location = new LocationSchema({
    name: name,
    fee: fee,
    disabled: false,
  });

  try {
    const data = await location.save();
    return {
      error: {
        message: "OK",
      },
      location: data,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLocations,
  addLocation,
};

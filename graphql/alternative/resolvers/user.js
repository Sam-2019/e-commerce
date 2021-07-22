const { UserSchema } = require("../../../db/newDB/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const genericImage =
  "https://www.beautifulpeople.com/cdn/beautifulpeople/images/default_profile/signup_male.png";

const getUsers = async () => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }
  try {
    const data = await UserSchema.find();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getUser = async ({ id }, req) => {
  // if (!req.isAuth) {
  //   return new Error("Unauthenticated");
  // }

  try {
    const data = await UserSchema.findById(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const signup = async (
  { input: { username, firstName, lastName, email, password, phoneNumber } },
  req
) => {
  const empty = firstName && lastName && email && password;

  if (empty === "") {
    return {
      error: {
        message: "Please fill all fields",
      },
    };
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new UserSchema({
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    password: hashedPassword,
    verified: false,
    photoURL: genericImage,
  });

  try {
    const data = await user.save();

    await jwt.sign({ userID: data._id }, `${process.env.JWT_SECRET}`);

    return {
      error: {
        message: "Registration Successful",
      },
      user: data,
    };
  } catch (err) {
    console.log(err);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await UserSchema.findOne({ email });

    if (!user) {
      return {
        error: {
          message: "Not registered",
        },
      };
    }

    const compareCurrentPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!compareCurrentPassword) {
      return {
        error: {
          message: "Password is incorrect",
        },
      };
    }

    const token = await jwt.sign(
      { userID: user._id },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "5h",
      }
    );

    return {
      token: token,
    };
  } catch (err) {
    return {
      error: {
        message: "User does not exist",
      },
    };
  }
};

module.exports = {
  getUsers,
  getUser,
  signup,
  login,
};

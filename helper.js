const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 12;
// const hashedPassword = await bcrypt.hash(password, saltRounds);

export const passwordEncrypt = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const passwordCompare = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

export const generateToken = (userID, userEmail) => {
  return jwt.sign({ ID: userID, email: userEmail }, "somesupersecretkey", {
    expiresIn: "1h",
  });
};

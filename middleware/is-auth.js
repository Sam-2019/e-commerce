const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

 console.log(req.get("Authorization"));

 // console.log(req.headers.authorization);

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }


  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  const secret = "somesupersecretkey";
  let decodeToken = null;
  try {
    decodeToken = jwt.verify(token, secret);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodeToken.userId;
  next();
}

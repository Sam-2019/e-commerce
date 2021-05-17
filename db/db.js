const mongoose = require("mongoose");
const keys = require("../db/keys");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect("mongodb://localhost:27017/e-commerce", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

var dbConn = mongoose.connection;
dbConn.on("connected", function () {
  console.log("Mongoose connected");
});

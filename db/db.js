const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var dbConn = mongoose.connection;
dbConn.on("connected", function () {
  console.log("Mongoose connected");
});

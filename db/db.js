const mongoose = require("mongoose");
const mongoURI = `mongodb+srv://${process.env.DB_TOKEN}:${process.env.DB_KEY}@cluster0.dottv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: false,
  useFindAndModify: false,
});

var dbConn = mongoose.connection;
dbConn.on("connected", function () {
  console.log("Mongoose connected");
});

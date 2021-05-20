const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  location: {
    type: String,
  },
  fee: {
    type: String,
  },
});

module.exports = mongoose.model("Location", LocationSchema);

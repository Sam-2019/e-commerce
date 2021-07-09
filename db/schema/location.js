const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  location: {
    type: String,
  },
  fee: {
    type: String,
  },
  disable: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Location", LocationSchema);

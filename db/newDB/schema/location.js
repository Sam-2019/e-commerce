const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  name: {
    type: String,
  },
  fee: {
    type: Number,
  },
  disabled: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Location", LocationSchema);

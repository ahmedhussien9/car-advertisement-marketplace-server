const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema for products

let products = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Products", products);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.model");
const Product = require("./products.model");
let ObjectId = require('mongodb').ObjectID;

let cart = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      type: Product.schema,
      required: false
    }
  ],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  creatorId: { type: Schema.Types.ObjectId, ref: "User" }
});
module.exports = mongoose.model("Cart", cart);

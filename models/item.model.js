const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const Schema = mongoose.Schema;
const Seller = require("../models/seller.model");

const itemSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

itemSchema.plugin(beautifyUnique);
module.exports = mongoose.model("Item", itemSchema);

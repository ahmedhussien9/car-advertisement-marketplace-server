const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const Schema = mongoose.Schema;
const Seller = require("../models/seller.model");

const timeSlotSchema = Schema({
  slotInterval: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
});

timeSlotSchema.plugin(beautifyUnique);
module.exports = mongoose.model("Slot", timeSlotSchema);

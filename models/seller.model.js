const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");
const Schema = mongoose.Schema;

const sellerSchem = Schema({
  fullName: {
    type: String,
    min: [5, "Too short, min is 5 characters"],
    max: [32, "Too long, max is 32 characters"],
  },
  email: {
    type: String,
    min: [5, "Too short, min is 5 characters"],
    max: [32, "Too long, max is 32 characters"],
    unique: true,
    lowercase: true,
    required: "Email is required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    min: [5, "Too short, min is 5 characters"],
    max: [32, "Too long, max is 32 characters"],
    required: "Password is required",
  },
});
sellerSchem.plugin(beautifyUnique);
module.exports = mongoose.model("Seller", sellerSchem);

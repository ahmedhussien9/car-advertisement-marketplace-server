const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = mongoose.Schema({
  name: { type: String, require: false },
  mobile: { type: String, require: true },
  city: { type: String, require: false },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
  },
  store: { type: String, require: false },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("User", userSchema);

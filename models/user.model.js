const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  mobile: { type: String, require: true },
  city: {type: String, require: false},
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: false,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  store: {type: String, require: false},
  // token: { type: String, require: true }
});


// userSchema.pre("save", function(next) {
//   this.token = this.generateToken();
//   next();
// });

// userSchema.methods.generateToken = function() {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       nick_name: this.nick_name,
//       phone_number: this.phone_number
//     },
//     "secret_this_should_be_longer",
//     {
//       expiresIn: "365d"
//     }
//   );
//   return token;
// };
module.exports = mongoose.model("User", userSchema);

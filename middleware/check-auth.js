const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const { ErrorHandler } = require("../helper/validationError");
const userService = require('../service/authService');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, 'secret_this_should_be_longer', async (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          console.log(decoded)
          let fetchedUser;
          try {
            fetchedUser = await Admin.findOne({ _id: decoded.userId });
            console.log(fetchedUser)
            req.userData = fetchedUser;
          }
          catch (err) {
            throw new ErrorHandler(401, "User not exist!");
          }
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  } catch (error) {
    next(error);
  }
};

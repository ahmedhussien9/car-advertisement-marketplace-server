const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../helper/validationError");
const Seller = require("../models/seller.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(
        token,
        "secret_this_should_be_longer",
        async (err, decoded) => {
          if (err) {
            return res.json({
              success: false,
              message: "Token is not valid",
            });
          } else {
            req.decoded = decoded;
            let fetchedUser;
            try {
              fetchedUser = await Seller.findOne({ _id: decoded.sellerId });
              req.userData = fetchedUser;
            } catch (err) {
              throw new ErrorHandler(401, "User not exist!");
            }
            next();
          }
        }
      );
    } else {
      return res.json({
        success: false,
        message: "Auth token is not supplied",
      });
    }
  } catch (error) {
    next(error);
  }
};

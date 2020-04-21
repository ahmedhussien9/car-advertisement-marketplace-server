const express = require("express");
const authRoute = express.Router();

const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const ValidationError = require("../../helper/validationError.modal");
const authService = require("../../service/authService");

authRoute.post("/signup", (request, response) => {
  try {
    if (!validator.isEmail(request.body.email)) {
      throw new ValidationError(510, "Please enter valid email");
    }
    bcrypt.hash(request.body.password, 10).then(hash => {
      const user = new User({
        first_name: request.body.firstName,
        last_name: request.body.lastName,
        nickname: request.body.nickName,
        phone_number: request.body.phoneNumber
      });
      user
        .save()
        .then(result => {
          response.status(201).json({
            message: "User Created Successfully",
            result: result
          });
        })
        .catch(err => {
          response.status(500).json({
            error: err
          });
        });
    });
  } catch (error) {
    response.status(error.code).json({
      message: error.message,
      stack: error.stack
    });
  }
});



authRoute.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log(result);
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed!",
          error: err
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        "secret_this_should_be_longer",
        {
          expiresIn: "1h"
        }
      );

      res.status(200).json({
        userId: fetchedUser._id,
        userData: fetchedUser,
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth Failed!",
        error: err
      });
    });
});


module.exports = authRoute;

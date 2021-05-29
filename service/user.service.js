const User = require("../models/user.model");
const { ErrorHandler } = require("../helper/validationError");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  /**
   * Create User Handler
   * 1- Check if user email exist or not
   * 2- if the user exist then throw an error else proceed to check the password
   * 3- we're going to bcrypt the password first and if there's an issue with hashing then throw error.
   * 4- And if the password is hashed successfully then create a new user and return his data.
   */

  async create(req) {
    const reqBody = req.body;
    let userEmail;
    userEmail = await User.findOne({
      email: reqBody.email,
    });

    if (userEmail) {
      throw new ErrorHandler(404, "Email already exist");
    }

    const hashPwd = await bcrypt.hash(reqBody.password, 10);

    if (!hashPwd) {
      throw new ErrorHandler(400, "Error hashing password");
    }

    const body = {
      fullName: reqBody.fullName,
      email: reqBody.email,
      password: hashPwd,
    };

    const createdUser = await User.create(body);

    if (!createdUser) {
      throw new ErrorHandler(500, "Server Error, can not create a user");
    }
    return createdUser;
  }

  /**
   * Login Seller Handler
   * 1- Check if user email exist or not
   * 2- if the user email is not exist then throw error
   * 3- if the password is not matching throw error
   * 4- if the user exist create a token
   * 5- return the user
   */

  async loginSeller(req) {
    let fetchedUser;
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new ErrorHandler(
        404,
        "Sorry, This email address doesn't exist, please signup"
      );
    }

    fetchedUser = user;

    let comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      throw new ErrorHandler(404, "Sorry, your password is not correct");
    }

    const token = jwt.sign(
      {
        fullName: fetchedUser.fullName,
        email: fetchedUser.email,
        userId: fetchedUser._id,
      },
      "secret_this_should_be_longer",
      {}
    );

    return {
      id: fetchedUser._id,
      fullName: fetchedUser.fullName,
      email: fetchedUser.email,
      token: token,
    };
  }

  async getAllUsers(req) {
    const searchQuery = req.query.search;
    const resPerPage = parseInt(req.query.limit);
    const page = parseInt(req.query.page) || 1;

    if (!req.query.search) {
      req.query.search = "";
    }
    const regex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );

    const foundUsers = await User.find({})
      .select("-password")
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    const numOfUsers = await User.count({ fullName: regex });

    const res = {
      users: foundUsers,
      currentPage: page,
      pages: Math.ceil(numOfUsers / resPerPage),
      searchVal: searchQuery,
      numOfResults: numOfUsers,
    };
    return res;
  }
}

module.exports = new UserService();

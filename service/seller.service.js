const Seller = require("../models/seller.model");
const { ErrorHandler } = require("../helper/validationError");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class SellerService {
  /**
   * Create Seller Handler
   * 1- Check if seller email exist or not
   * 2- if the seller exist then throw an error else proceed to check the password
   * 3- we're going to bcrypt the password first and if there's an issue with hashing then throw error.
   * 4- And if the password is hashed successfully then create a new seller and return his data.
   */

  async create(req) {
    const reqBody = req.body;
    let userEmail;
    userEmail = await Seller.findOne({
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
      type: reqBody.type,
    };

    const createdSeller = await Seller.create(body);

    if (!createdSeller) {
      throw new ErrorHandler(500, "Server Error, can not create a seller");
    }
    return createdSeller;
  }

  /**
   * Login Seller Handler
   * 1- Check if seller email exist or not
   * 2- if the seller email is not exist then throw error
   * 3- if the password is not matching throw error
   * 4- if the user exist create a token
   * 5- return the seller
   */

  async loginSeller(req) {
    let fetchedSeller;
    let seller = await Seller.findOne({ email: req.body.email });
    if (!seller) {
      throw new ErrorHandler(
        404,
        "Sorry, This email address doesn't exist, please signup"
      );
    }

    fetchedSeller = seller;

    let comparePassword = await bcrypt.compare(
      req.body.password,
      seller.password
    );
    console.log(comparePassword);
    if (!comparePassword) {
      throw new ErrorHandler(404, "Sorry, your password is not correct");
    }

    const token = jwt.sign(
      {
        fullName: fetchedSeller.fullName,
        email: fetchedSeller.email,
        sellerId: fetchedSeller._id,
      },
      "secret_this_should_be_longer",
      {}
    );

    return {
      id: fetchedSeller._id,
      fullName: fetchedSeller.fullName,
      email: fetchedSeller.email,
      token: token,
    };
  }

  async getAllSellers(req) {
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

    const foundSellers = await Seller.find({})
      .select("-password")
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    const numOfSellers = await Seller.count({ fullName: regex });

    const res = {
      sellers: foundSellers,
      currentPage: page,
      pages: Math.ceil(numOfSellers / resPerPage),
      searchVal: searchQuery,
      numOfResults: numOfSellers,
    };
    return res;
  }
}

module.exports = new SellerService();

const User = require("../models/user.model");
const request = require('request');
class AuthService {

  async create(userData) {
    const res = await User.create(userData);

    return res;
  }


  async getAllUsers(request) {
    console.log(request.query);
    if (!request.query.search) {
      request.query.search = ''
    }
    const searchQuery = request.query.search;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const resPerPage = parseInt(request.query.limit);
    const page = parseInt(request.query.page) || 1;
    const foundUsers = await User.find({ store: regex })
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage);
    const numOfUsers = await User.count({ store: regex });
    const res = {
      users: foundUsers,
      currentPage: page,
      pages: Math.ceil(numOfUsers / resPerPage),
      searchVal: searchQuery,
      numOfResults: numOfUsers
    }
    return res;
  }
  removeUserHandler(userId) {
    const user = User.findByIdAndDelete({ _id: userId.toString() });
    return user;
  }


  async getAll() {
    const res = await User.find();
    return res;
  }

  async getSingleUser(userId) {
    const res = await User.findById(userId);
    return res;
  }

}

module.exports = new AuthService();

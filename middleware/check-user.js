const User = require("../models/user.model");
const validateSchemaMiddleWare = require("../middleware/validator");

class CheckUserMiddleWare {
  async checkUserExist(userId) {
    const user = await User.find(userId);
    if (!user) {
      throw Error("User not Exist");
    }
  }
}

module.exports = new CheckUserMiddleWare();

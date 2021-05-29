const { ErrorHandler } = require("../helper/validationError");
const ItemDB = require("../models/item.model");

class ItemService {
  // Create new item handler;
  async create(req) {
    if (!req.body) {
      throw new ErrorHandler(400, "Sorry, Content can not be empty!");
    }
    const item = new ItemDB({
      name: req.body.name,
      description: req.body.description,
      seller: req.body.seller,
      image: req.body.image,
    });
    const createdItem = await item.save(item);
    if (!createdItem) {
      throw new ErrorHandler(
        500,
        "Some error occurred while creating a new item"
      );
    }
    return item;
  }

  // Get all items;
  async getAll(req) {
    const query = req.query.seller || "";
    const items = ItemDB.aggregate([
      {
        $lookup: {
          from: "sellers",
          localField: "seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $match: { "seller.fullName": { $regex: new RegExp(query, "i") } } },
    ]);
    return items;
  }
}
module.exports = new ItemService();

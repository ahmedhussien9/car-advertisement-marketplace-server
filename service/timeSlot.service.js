const { ErrorHandler } = require("../helper/validationError");
const timeSlotDB = require("../models/timeSlot.model");
const sellerDB = require("../models/seller.model");
const ObjectID = require("mongodb").ObjectID;

class TimeSlotService {
  // Create new time slot handler;
  async create(req) {
    if (!req.body) {
      throw new ErrorHandler(400, "Sorry, Content can not be empty!");
    }
    const timeSlot = new timeSlotDB({
      slotInterval: req.body.slotInterval,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      seller: req.body.seller,
    });
    const createdTimeSlot = await timeSlot.save(timeSlot);
    if (!createdTimeSlot) {
      throw new ErrorHandler(
        500,
        "Some error occurred while creating a new Time Slot"
      );
    }
    return timeSlot;
  }

  // Get all Time slots;
  async getSellerTimeSlot(sellerID) {
    const sellerTimeSlot = await timeSlotDB.findOne({ seller: sellerID });
    const seller = await sellerDB.findById({ _id: sellerID });

    if (!ObjectID.isValid(sellerID)) {
      throw new ErrorHandler(404, "Sorry, the seller id is not valid");
    }
    if (!sellerTimeSlot) {
      throw new ErrorHandler(404, "Sorry, seller time slot doesn't exist!");
    }
    if (!seller) {
      throw new ErrorHandler(404, "Sorry, seller time slot doesn't exist!");
    }

    return sellerTimeSlot;
  }
}
module.exports = new TimeSlotService();

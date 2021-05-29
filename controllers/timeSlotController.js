const router = require("express").Router();
const generateTimeSlots =
  require("../helper/timeSlotHandler").generateTimeSlots;
const { ErrorHandler } = require("../helper/validationError");
const timeSlotService = require("../service/timeSlot.service");

// Route for creating new item
router.post("/create", async (req, res, next) => {
  try {
    const timeSlot = await timeSlotService.create(req);
    res.status(200).send({
      message: "Congratulations, time slot created successfully",
      item: timeSlot,
    });
  } catch (err) {
    next(err);
  }
});

// Route for getting seller time slot
router.get("/:sellerId", async (req, res, next) => {
  try {
    const sellerTimeSlot = await timeSlotService.getSellerTimeSlot(
      req.params.sellerId
    );

    const avaliableSlots = generateTimeSlots({
      startTime: sellerTimeSlot.startTime,
      endTime: sellerTimeSlot.endTime,
      slotInterval: sellerTimeSlot.slotInterval,
    });

    res.status(200).send({
      status: "success",
      body: {
        sellerTimeSlots: sellerTimeSlot,
        slots: avaliableSlots,
      },
      code: 200,
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;

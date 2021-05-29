const router = require("express").Router();
const itemService = require("../service/item.service");

// Route for creating new item
router.post("/create", async (req, res, next) => {
  try {
    const createdItem = await itemService.create(req);
    res.status(200).send({
      message: "Congratulations, item created successfully",
      item: createdItem,
    });
  } catch (err) {
    next(err);
  }
});

// Route for getting all items from DB
router.get("/", async (req, res, next) => {
  try {
    const items = await itemService.getAll(req);
    res.status(200).send({
      items: items,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

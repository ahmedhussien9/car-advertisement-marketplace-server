const router = require("express").Router();
const SellerService = require("../service/seller.service");

router.post("/signup", async (req, res, next) => {
  try {
    const seller = await SellerService.create(req);
    res.status(201).json({
      message: "Congratulations your account has been created, please login",
      seller,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const seller = await SellerService.loginSeller(req);
    res.status(200).json({
      message: `Welcome Back ${seller.fullName}`,
      status: "success",
      body: seller,
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allSellers = await SellerService.getAllSellers(req);
    res.send({
      status: "success",
      code: 200,
      message: "All Sellers",
      body: allSellers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

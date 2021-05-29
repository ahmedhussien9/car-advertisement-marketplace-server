const router = require("express").Router();
const UserService = require("../service/user.service");

router.post("/signup", async (req, res, next) => {
  try {
    const user = await UserService.create(req);
    res.status(201).json({
      message: "Congratulations your account has been created, please login",
      user,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserService.loginSeller(req);
    res.status(200).json({
      message: `Welcome Back ${user.fullName}`,
      status: "success",
      body: user,
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await UserService.getAllUsers(req);
    res.send({
      status: "success",
      code: 200,
      message: "All Users",
      body: allUsers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

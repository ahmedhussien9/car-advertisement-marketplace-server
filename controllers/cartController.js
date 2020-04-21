const router = require("express").Router();
const cartService = require("../service/cartService");
const productService = require("../service/productService");
const { ErrorHandler } = require("../helper/validationError");
const userService = require("../service/authService");

let ObjectId = require('mongodb').ObjectID;

// get All carts
router.get("/", async (request, response) => {
  try {
    const allCart = await cartService.getAll();
    response.send({
      code: 200,
      status: "success",
      message: "All Cart",
      body: allCart
    });
  } catch (error) {

    next(error);
  }
});

// Create new cart
router.post("/", async (request, respone, next) => {
  try {
    // 1. Create cart
    const cart = await cartService.create(request, next);
    // 2. Send response with extra info
    respone.send({
      code: 200,
      status: "success",
      message: "Cart has been created!",
      body: cart
    });
  } catch (error) {
    console.log(error)
    // Fetch error
    next(error);
  }
});

// Add user to cart 
router.post("/:cartId/user/:userId", async (request, response, next) => {
  try {
    // 1. Get cart data
    const cart = await cartService.addUserToCart(request, next);
    // 2. Send the request 
    response.send({
      status: 201,
      message: "User added successfully in cart",
      body: cart
    });
  } catch (error) {
    // Fetch errors
    next(error);
  }
});

// remove user from cart route
router.delete("/:cartId/user/:userId", async (request, response, next) => {
  try {

    const cart = await cartService.removeUserFromCartHandler(request);
    console.log(cart);
    // 2. send success message
    response.send({
      code: 200,
      status: "success",
      message: "Success, user and has products removed from cart!",
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});



// get single cart
router.get("/:cartId", async (request, response, next) => {
  try {
    // 1. get cart data from db if exist 
    const cartData = await cartService.getSingleCartHandler(request, next);
    // 2. send reponse with the cart data if found
    response.send({
      status: "success",
      code: 200,
      body: cartData
    });
  } catch (error) {
    next(error);
  }
});

// add product to cart route
router.post("/:cartId/product/:productId", async (request, respone, next) => {
  try {
    const cartData = await cartService.addProductToCart(request);
    console.log(cartData)
    respone.send({
      status: "success",
      code: 200,
      message: "Product added successfully for this cart",
      body: cartData
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

// remove single cart route
router.delete("/:cartId", async (request, response, next) => {
  try {
    await cartService.removeSingleCart(request, next);
    response.send({
      status: "success",
      code: 200,
      message: "Cart has been removed successfully"
    });
  } catch (error) {
    next(error);
  }
});

// remove product from cart !!!
router.delete(
  "/:cartId/product/:productId",
  async (request, response, next) => {
    try {
      await cartService.rvProductFromCart(request, next);
      response.send({
        status: "success",
        code: 200,
        message: "Product removed sucessffully"
      });

    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;

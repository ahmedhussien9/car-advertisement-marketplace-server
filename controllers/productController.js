const router = require("express").Router();
const validateSchemaMiddleWare = require("../middleware/validator");
const schemaValidator = require("../helper/validationSchemas");
const ProductService = require("../service/productService");

router.post("/", async (request, response) => {
  try {
    validateSchemaMiddleWare.schemaValidationHandler(
      schemaValidator["product"],
      request.body
    );
    const productData = await ProductService.create(request.body);
    response.status(201).send({
      message: "Product data created successfully!",
      body: productData
    });
  } catch (error) {
    response.status(500).send({
      error: error.message,
    });
  }
});

router.get("/", async (request, response) => {
  try {
    const products = await ProductService.getAll();
    response.status(201).send({
      message: "Products data!",
      body: products
    });
  } catch (error) {
    response.status(500).send({
      error: error,
      message: message
    });
  }
});

router.get("/:userId", async (request, response) => {
  try {
    const userId = request.params.userId;
    const singleUserProducts = await ProductService.getProductsForUser(userId);
    response.status(201).send({
      message: `Products for userId ${userId}`,
      body: singleUserProducts
    });
  } catch (error) {
    response.status(500).send({
      error: error,
      message: "Internal server error!"
    });
  }
});

router.delete("/:productId", async (request, response) => {
  try {
    const userId = request.userData._id;
    const productId = request.params.productId;
    const product = await ProductService.remove(userId, productId);
    response.status(201).send({
      message: `product ${productId} has been deleted!`,
      body: product
    });
  } catch (error) {
    response.status(500).send({
      message: error.message
    });
  }
});
module.exports = router;

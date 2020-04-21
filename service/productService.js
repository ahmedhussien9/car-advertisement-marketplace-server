const Product = require("../models/products.model");
class ProductService {
  async create(productData) {
    const product = await Product.create(productData);
    return product;
  }

  async getAll() {
    const products = await Product.find();
    return products;
  }

  async getProductsForUser(userId) {
    const singleUserProducts = await Product.find({ creatorId: userId });
    return singleUserProducts;
  }

  async getSingleProduct(productId) {
    const product = await Product.findById(productId);
    return product;
  }

  async remove(userId, productId) {
    // 1. find the product which need to be removed using the product id
    const product = await Product.findById(productId);
    // 2. if there is no product found throw error
    if (!product) {
      throw new Error("Product doesn't exist!");
    }
    // 3. if the user id which need to remove the product equal to the creator of the product remove it 
    if (product && product.creatorId.toString() === userId.toString()) {
      const product = await Product.findByIdAndRemove(productId);
      return product;
    } else {
      throw new Error("You don't have the authority to delete this product");
    }
  }
}
module.exports = new ProductService();

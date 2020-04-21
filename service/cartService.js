const mongoose = require('mongoose');
const Cart = require("../models/cart.model");
const { ErrorHandler } = require("../helper/validationError");
const authService = require("../service/authService");
const productService = require('../service/productService');

let ObjectId = require('mongodb').ObjectID;

class CartService {

  async create(request, next) {
    // 1. Save Cart Body
    const cartBody = request.body;
    // 2. Fetch user id
    const userId = request.userData._id;
    // 3. assign cart creator 
    request.body.creatorId = userId;
    // 4. Get user from DB
    const user = await authService.getSingleUser(userId);

    // 5. Check if user exist in the DB 
    if (!user) {
      throw new ErrorHandler(404, "Sorry, This is user don't exist in DB");
    }

    // 6. Check if user id is not exist
    if (!userId) {
      throw new ErrorHandler(404, "Sorry, Missing required creatorId for this cart");
    }

    // 7. Create cart in DB
    const res = await Cart.create(cartBody);


    // 8. Push cart creator Id to cart users
    res.users.push(request.userData._id);

    // 9. Save cart into datebase
    await res.save();

    // 10. Return the created cart
    return res;
  }

  async addUserToCart(request, next) {
    // 1. get the user id that need to be added to the cart.
    const userId = request.params.userId;
    // 2. get the cart id that need to add user to it.
    const cartId = request.params.cartId;
    // 3. get cart creator id
    const creatorId = request.userData._id;



    // 4. fetch cart by using the cart it
    const fetchedCart = await this.getSingleCart(cartId);
    // 5. fetch user by using the user id that need to be added
    const fetchedUser = await authService.getSingleUser(userId);



    // 6. Check if the creator for this cart want to add himself again !!!
    if (fetchedCart.creatorId.toString() === userId.toString()) {
      throw new ErrorHandler(404, "Sorry, this user already exist and he is the creator for this cart");
    }

    // 7. Check is the user that want to add user was the creator or Not!!!
    if (fetchedCart.creatorId.toString() !== creatorId.toString()) {
      throw new ErrorHandler(404, 'Sorry, you have no access to add user for this cart');
    }

    // 8. Check the cart id and user id exists or not 
    if (!userId || !cartId) {
      throw new ErrorHandler(404, "Sorry, Something not correct in your url");
    }

    // 9. Check if there is no cart exist in the DB
    if (!fetchedCart) {
      throw new ErrorHandler(404, "Sorry, This cart is not exist");
    }

    // 10. Check if there is no user exist in the DB
    if (!fetchedUser) {
      throw new ErrorHandler(401, "Sorry, This user is not exist!");
    }

    // 11. Check if the user already exist or NOT!!
    if (fetchedCart.users.includes(userId)) {
      throw new ErrorHandler(404, "Sorry, This user already exist in this cart");
    }

    // 12. Add the user if there is no issue 
    fetchedCart.users.push(userId);

    // 13. Save the cart again with the new user
    const cart = await fetchedCart.save();

    return cart;


  }

  async removeUserFromCartHandler(request) {
    // 1. remove user and has product from cart handler
    // 1. get the user id that need to be added to the cart.
    const userId = request.params.userId;
    // 2. get cart id that will remove user from it
    const cartId = request.params.cartId;
    // 3. get user id from token to help us check if he is the creator or not!
    const userIdFromToken = request.userData._id;
    // 4. 
    const fetchedCart = await this.getSingleCart(cartId);
    const fetchedUser = await authService.getSingleUser(
      userId
    );
    if (!userId || !cartId) {
      throw new ErrorHandler(404, "Something not correct in your url");
    }
    if (!fetchedCart) {
      throw new ErrorHandler(404, "Sorry, this cart is not exist");
    }
    if (!fetchedUser) {
      throw new ErrorHandler(404, "Sorry, this user is not exist!");
    }

    if (userId.toString() === userIdFromToken.toString()) {
      throw new ErrorHandler(404, "Sorry, you are the creator for this cart!!");
    }

    if (!fetchedCart.users.includes(userId)) {
      throw new ErrorHandler(
        401,
        "Sorry, this user doesn't exist in this cart!"
      );
    }
    await this.removeUserFromCart(cartId, userId);
    return await this.removeUserProductsFromCart(
      cartId,
      userId
    );
  }

  async rvProductFromCart(request, next) {
    // 1. get cart id and product id from params
    const { cartId, productId } = request.params;
    // 2. get user id from userData
    const userId = request.userData._id;
    // 3. get cart data from DB
    const cartData = await this.getSingleCart(cartId);
    // 4. get product by user id from cart
    const productInCart = await this.getProductByUserIdFromCart(cartId, productId, userId);
    // 5. check if there is not cart data throw error 
    if (!cartData) {
      throw new ErrorHandler(404, "Sorry, This cart doesn't exist");
    }
    // 6. check if there is not product with this id in the cart
    if ((Object.keys(productInCart).length === 0 &&
      productInCart.constructor === Object) ||
      productInCart.products.length === 0) {
      throw new ErrorHandler(404, "Sorry, There is no product found in this cart");
    }

    // 7. check if the user have no access to delete this product from cart
    if (+
      (cartData.creatorId.toString() !== userId.toString()) &&
      (productInCart.products[0].userId.toString() !== userId.toString())
    ) {
      throw new ErrorHandler(404, "Sorry, You have no access to delete this product");
    }
    // 8. send respone 
    let cart = await this.removeProductFromCart(cartId, productId);
    return cart;

  }

  async addProductToCart(request) {
    // 1. get cart id and product id
    const { cartId, productId } = request.params;
    // 2. get user id from user data
    const userId = request.userData._id;
    // 3. get cart data from DB
    const cartData = await this.getSingleCart(cartId);
    // 4. get product data from DB
    const productData = await productService.getSingleProduct(productId);
    // 5. get product by user id from cart to check if exist or no
    const productInCart = await this.getProductByUserIdFromCart(userId);
    let isAdmin = false;
    // 6. Check if there is any cart or NOT!!!
    if (!cartData) {
      throw new ErrorHandler(404, "Sorry, This cart doesn't exist");
    }
    // 7. Check if the product exist in DB or Not!!!
    if (!productData) {
      throw new ErrorHandler(404, "Sorry, This product doesn't exist!");
    }

    // 8. Check if the user have access to add in this cart or NOT!!!
    if (!cartData.users.includes(userId)) {
      throw new ErrorHandler(404, "Sorry, You have no access to add product for this cart");
    }

    // 9. Check if the product is exist so you can't duplicate it;
    if (productInCart) {
      throw new ErrorHandler(404, "Sorry, You already added this product in this cart before");
    }
    // 10. add user id to the product that will be added to the cart
    productData.userId = userId;
    // 11. generate new object id for the product which will be added to the cart
    productData._id = new ObjectId();
    // 12. push the product to cart products
    cartData.products.push(productData);

    // 13. save cart 
    const res = await cartData.save();

    // 14. Return response
    return res;
  }



  async getProductByUserIdFromCart(cartId, productId, userId) {
    const product = await Cart.findOne(
      {
        _id: mongoose.Types.ObjectId(cartId),
      },
      {
        'products': {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(productId),
          },
        },
      },
      { 'products.$': 1 }
    );
    return product;
  }


  async getCartForSingleUser(request) {
    // 1. UserId from the params
    const userId = request.params.userId;
    // 2. UserId from the token
    const reqUid = request.userData._id;
    // 3. Check if the same user who sent this request is equal to the user who want to show has cart data!
    if (userId.toString() !== reqUid.toString()) {
      throw new ErrorHandler(
        400,
        `Sorry, You don't have access to display this cart for this user ${userId}`
      );
    }
    // 4. find cart by user id
    const cart = await Cart.find({ creatorId: userId });
    return cart;
  }


  async removeSingleCart(request, next) {
    // 1. get cart id that want to be removed
    const cartId = request.params.cartId;
    // 2. get user id that want to remove cart
    const userId = request.userData._id;
    // 3. get cart data from carts DB
    const cartData = await this.getSingleCart(cartId);
    // 4. check if no cart data exist throw error
    if (!cartData) {
      throw new ErrorHandler(400, "Sorry, This cart doesn't exist");
    }

    // 5. check if user id doesn't the creator throw error
    if (cartData.creatorId.toString() !== userId.toString()) {
      throw new ErrorHandler(
        400,
        "Sorry, you don't have access to remove this cart"
      );
    }
    // 6. get the cart and remove it
    const cart = await Cart.findByIdAndRemove(cartId);
    return cart;

  }

  async getSingleCartHandler(request, next) {
    try {
      const userId = request.userData._id;
      const cartId = request.params.cartId;
      if (!cartId) {
        throw new ErrorHandler(400, "Sorry, Missing cart id");
      }
      const cartData = await this.getSingleCart(cartId);
      if (!cartData) {
        throw new ErrorHandler(400, "Sorry, there is no cart found");
      }
      return cartData;
    } catch (error) {
      next(error)
    }
  }


  async getAll() {
    const res = await Cart.find();
    return res;
  }

  async getSingleCart(cardId) {
    const cart = await Cart.findById(cardId);
    return cart;
  }


  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findOneAndUpdate(
      {
        _id: cartId
      },
      {
        $pull: {
          products: {
            _id: mongoose.Types.ObjectId(productId)
          }
        }
      }
    );
    return cart;
  }

  async removeUserProductsFromCart(cartId, userId) {
    const cart = await Cart.findOneAndUpdate(
      {
        _id: cartId
      },
      {
        $pull: {
          products: {
            userId: userId
          }
        }
      }
    );
    return cart;
  }

  async removeUserFromCart(cartId, userId) {
    const cart = await Cart.findOneAndUpdate(
      {
        _id: cartId
      },
      { $pull: { users: userId } }
    );
    return cart;
  }
}

module.exports = new CartService();

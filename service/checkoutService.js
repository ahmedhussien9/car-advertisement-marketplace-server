const mongoose = require('mongoose');
const Cart = require("../models/cart.model");
const { ErrorHandler } = require("../helper/validationError");
const CartService = require("../service/cartService");
let ObjectId = require('mongodb').ObjectID;


class CheckoutService {

    async checkoutHandler(request) {
        const cartId = request.params.cartId;
        const userId = request.userData._id;
        const cartData = await CartService.getSingleCart(cartId);
        if (cartData === null) {
            throw new ErrorHandler(404, 'Sorry, There is no cart found with this ID');
        }
        if (cartData.products.length === 0) {
            throw new ErrorHandler(404, "Sorry, You can't checkout, because there is not products found in this cart");
        }
        if (!cartData.users.includes(userId)) {
            throw new ErrorHandler(404, "Sorry, You don't have access to checkout this cart");
        }
        const checkout = await this.orderPriceSum(cartId);
        if (checkout === undefined || checkout.length == 0) {
            throw new ErrorHandler(404, '');
        }
        return checkout;
    }

    async orderPriceSum(cartId) {
        const checkout = await Cart.aggregate([
            {
                "$match": { "_id": ObjectId(cartId) }
            },
            {
                "$unwind": "$products"
            },
            {
                $group: {
                    "_id": cartId,
                    "totalOrderPrice": { "$sum": { "$sum": "$products.price" } },
                }
            }
        ]);
        return checkout;
    }
}

module.exports = new CheckoutService();

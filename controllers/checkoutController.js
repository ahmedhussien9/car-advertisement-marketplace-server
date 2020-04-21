const router = require("express").Router();
const CheckoutService = require("../service/checkoutService");

router.post("/:cartId", async (request, response, next) => {
    try {
        const totalOrderPrice = await CheckoutService.checkoutHandler(request);
        response.send({
            status: "success",
            code: 200,
            message: "Thank you!",
            body: totalOrderPrice
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
});
module.exports = router;

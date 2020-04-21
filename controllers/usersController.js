const router = require("express").Router();
const authService = require("../service/authService");
const { ErrorHandler } = require("../helper/validationError");

router.post("/create", async (request, reponse, next) => {
    try {
        const userData = request.body;
        if (!userData.mobile) {
            throw new ErrorHandler(404, "Please enter your mobile number")
        }
        const savedUserData = await authService.create({
            ...userData
        });
        reponse.status(200).send({
            message: "Thank you!",
            body: savedUserData
        });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            reponse.status(404).json({
                status: "error",
                message: 'Sorry, This email already exist!'
            });
            return
        }
        next(error);
    }
});

// Get All users from DB
router.get("/", async (request, response, next) => {
    try {
        console.log(request.query)
        // 1. Get all users from DB
        const allUsers = await authService.getAllUsers(request);
        // 2. Send all users in the response    
        response.send({
            status: "success",
            code: 200,
            message: "All users",
            data: allUsers
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
});


router.delete("/:userId", async (request, response, next) => {
    try {
        const user = await authService.removeUserHandler(request.params.userId);
        // 2. send success message
        response.send({
            code: 200,
            status: "success",
            message: "Success, user and removed from successfully!",
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
});


module.exports = router;

const {Router} = require("express")
const router = Router()

const authController = require("../controller/secure/AuthController")
const payController = require("../controller/paymentController")


router.post("/checkout-sessions/:tourId" , authController.protect ,payController.paymentTour)

module.exports = router
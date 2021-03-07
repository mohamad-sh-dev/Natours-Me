const {Router} = require("express")
const router = Router()
const viewsCrr = require("../controller/viewController")
const {ifLoggedIn,protect, restrictTo} = require("../controller/secure/AuthController")
const cors = require("cors")




// ifLoggendIn Function for who users logged in and send user to rendered pages as a variable (res.locals.user)
router.use(ifLoggedIn)
router.use(cors())

router.get('/', viewsCrr.MainPage)

router.get("/tour/:id",viewsCrr.detailTour)

router.get("/login" , viewsCrr.getLogin )

router.get("/me",protect,viewsCrr.userAcount)

router.get("/users",protect,restrictTo("admin"),viewsCrr.GetUsers)

//router.use("*" , viewsCrr.errController)

module.exports = router
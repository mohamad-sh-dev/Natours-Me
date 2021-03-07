const {Router} = require("express")
const router = Router()
const AppError = require("../utils/appErrors")

//404 route

router.use("",(req,res,next)=>{
next(new AppError ("Fail",400))
})




module.exports = router;
const {
    Router
} = require("express")
const router = Router({mergeParams:true})

const {protect,restrictTo} = require("../controller/secure/AuthController")
const {getAllReviews,CreateReview,updateReview,DeleteReview,getReview,sendTourIdAndUserId} = require("../controller/reviewController")

//! Nested Routes (Create Review With Params id Tour(Exist in req.params) And User id (Exist In Jwt) )
//desc : 
// Route: /api/v1/tours/tourId/reviews
router.post("/reviews",protect,sendTourIdAndUserId,CreateReview)
//! Finde Reviews Of Specific Tour 
// api/v1/tours/tourId/reviews
router.get("/reviews",protect,getAllReviews)

// Regular Routs
// Route : /api/v1/reviews
router.get("/allReviews",protect,getAllReviews)
// Create A Review With Req.Body => review,rating,user,tour

router.post("/createReview",protect,CreateReview)

router.get("/:id",protect,getReview)

router.patch("/updateReview/:id",protect,restrictTo("user"),updateReview)

router.delete("/deleteReview/:id",protect,restrictTo("admin"),DeleteReview)

module.exports = router

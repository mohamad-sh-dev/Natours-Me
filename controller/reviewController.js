const Review = require("../model/reviewSchema")
const Fuctory = require("../controller/FacturyFunction")


exports.sendTourIdAndUserId = (req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
}



exports.getAllReviews = Fuctory.getAll(Review)
exports.CreateReview = Fuctory.creatrOne(Review)
exports.getReview = Fuctory.getOne(Review)
exports.updateReview = Fuctory.updateOne(Review)
exports.DeleteReview = Fuctory.deleteOne(Review)


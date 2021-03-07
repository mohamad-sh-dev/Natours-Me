const {
    Router
} = require("express")
const router = Router()
const reviewRoter = require("../routes/reviewRoutes")

const {
    monthlyPlan,
    stats,
    top5,
    GetTours,
    CreateTour,
    FindTourbyID,
    UpdateTour,
    DeleteTour,
    getToursWithin,
    getDistances
} = require("../controller/ToursController")

const {
    uploadTourPhoto,
    resizeTourPhoto
} = require("../controller/photoController")
const {
    protect,
    restrictTo
} = require("../controller/secure/AuthController")
const { get } = require("./paymentRouts")

// Nested Routes 
// /tours/a51aa54fgsrg1323/reviews

router.use('/:tourId', reviewRoter)

// Desc :  Tours
// Methods : Get / POST / PATCH 

router.get('/', GetTours)

router.post('/create-tour', protect, restrictTo("admin", "lead-giude"), CreateTour)

router.get('/monthly-plan/:year', protect, monthlyPlan)

router.get('/tours-stats', stats)

router.get('/top-5-tours', top5, GetTours)

router.route('/:id').get(FindTourbyID)
.patch(protect, restrictTo("admin", "lead-giude"), uploadTourPhoto, resizeTourPhoto, UpdateTour)
.delete(protect, restrictTo("admin", "lead-giude"), DeleteTour)


router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin)

router.get('/distances/:latlng/unit/:unit', getDistances)







module.exports = router;
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

router.get('/:id', FindTourbyID)
.patch(protect, restrictTo("admin", "lead-giude"), uploadTourPhoto, resizeTourPhoto, UpdateTour)
.delete(protect, restrictTo("admin", "lead-giude"), DeleteTour)


router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin)

router.get('/distances/:latlng/unit/:unit', getDistances)

router.patch('/:id', protect, restrictTo("admin", "lead-giude"), uploadTourPhoto, resizeTourPhoto, UpdateTour)

router.delete('/:id', protect, restrictTo("admin", "lead-giude"), DeleteTour)






module.exports = router;
const Tour = require("../model/tourSchema")
const catchAsync = require('../utils/cathAsync')
const Fuctory = require("../controller/FacturyFunction")
const AppError = require("../utils/appErrors")

const SendRes = (data, statusCode, res) => {

    res.status(statusCode).json({
        status: "Success",
        Result: data.length,
        data
    })
}

exports.top5 = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,-price'
    req.query.fields = 'name,duration,summary,price,ratingsAverage'
    next()
}


// Get / Find / Create / Update / Delete Tours
exports.GetTours = Fuctory.getAll(Tour)
exports.FindTourbyID = Fuctory.getOne(Tour, {
    path: "reviews"
})
exports.CreateTour = Fuctory.creatrOne(Tour)
exports.UpdateTour = Fuctory.updateOne(Tour)
exports.DeleteTour = Fuctory.deleteOne(Tour)


// Get Stats Of The Tours (Use Aggregate!)

exports.stats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([{
            $match: {
                ratingsAverage: {
                    $gte: 4.2
                }
            }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: {
                    $sum: 1
                },
                numRatings: {
                    $sum: '$ratingsQuantity'
                },
                avgRating: {
                    $avg: '$ratingsAverage'
                },
                avgPrice: {
                    $avg: '$price'
                },
                minPrice: {
                    $min: '$price'
                },
                maxPrice: {
                    $max: '$price'
                },

            }
        }

    ])
    res.status(200).json({
        status: 'success',
        data: stats
    });


})

// Get Plan Tours Based On Month (Use Aggregate!)

exports.monthlyPlan = catchAsync(async (req, res, next) => {

    //set year variable
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
        //use unwind for an array field => 'startDates'
        {
            $unwind: '$startDates'
        },
        {
            //calculate the year
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            },
        },
        {
            //Grouping By month
            $group: {
                _id: {
                    $month: '$startDates'
                },
                numTourStart: {
                    $sum: 1
                },
                tours: {
                    $push: '$name'
                },
            },
        },
        {
            //Add 'month' insted of '_id'
            $addFields: {
                month: '$_id'
            }
        },
        {
            //disapear the id Field
            $project: {
                _id: 0
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        Result: plan.length,
        data: plan,

    });
})

// Find Tours Based On Radius Of UserLocations (Thats A huge feature)
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const {
        distance,
        latlng,
        unit
    } = req.params
    const [lat, lng] = latlng.split(",")

    if (!lat || !lng) return next(new AppError("لطفا مختصات محل فعلی خود را وارد کنید", 400))
    const radius = unit == "mi" ? distance / 3963.2 : distance / 6378.1
    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    })


    console.log(distance, latlng, unit);
    SendRes(tours, 200, res)
})

// Get Tour Distances From Current Location
exports.getDistances = catchAsync(async (req, res, next) => {
    const {
        latlng,
        unit
    } = req.params
    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) return next (new AppError("لطفا مختصات محل فعلی خود را وارد کنید", 400))
    const Multiplier = unit === "mi" ? 0.000621371  : 0.001 
    const distances = await Tour.aggregate([

        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField:"distance",
                distanceMultiplier: Multiplier
            }
        }, 
        {
            $project:{
                distance:1,
                name:1
            }
        }

    ])

    SendRes(distances,200,res)
})
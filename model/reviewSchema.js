const mongoose = require("mongoose")
const Tour = require("./tourSchema")


const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        max: 5.0,
        min: 1.0,
        // set: value => Math.round(value * 10) / 10
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: true
    }

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

reviewSchema.index({tour: 1 , user: 1} ,{unique:true})

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: 'name photo'
    })
    next()
})

// Calcularint Review Quantity And Avearege Rating (Mind Blower Procees :D) 
reviewSchema.statics.CalcAvgRating = async function (tourId) {
    const stats = await this.aggregate([{
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: "tour",
                nRatings: {
                    $sum: 1
                },
                avgRating: {
                    $avg: "$rating"
                }
            }
        }
    ])
    // Save Result On Database 
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })

    }
}
// Call CalcAvgRating Function (poffff!!!!)
reviewSchema.post("save", function () {
    this.constructor.CalcAvgRating(this.tour)
})

// This Methods For when updating a Review or Deleting It ! 
// Mind Blowing Just it :DD
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.CalcAvgRating(this.r.tour)
})

const Review = mongoose.model("Reviews", reviewSchema)
module.exports = Review
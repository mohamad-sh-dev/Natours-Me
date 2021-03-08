const mongoose = require("mongoose");
const User = require("./userSchema")


const tourSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "تور باید نام داشته باشد"],
        trim: true,
        unique: true,
        maxlength: [40, "نام تور حداکثر می تواند 40 کاراکتر داشته باشد"],
        minlength: [10, "نام تور نمیتواند کمتر از 10 کاراکتر داشته باشد"]
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: [true, "تور باید مدت زمان داشته باشد"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "تور باید تعداد اعضای گروه داشته باشد"],

    },
    difficulty: {
        type: String,
        required: [true, "تور باید عنوان درجه سختی داشته باشد"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "لطفا فقط یکی از سه حالت اسان سخت و مشکل را انتخاب کنید"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5.0, "رتبه بندی نمی تواند بیشتر از 5.0 باشد"],
        min: [1.0, "رتبه بندی نمی تواند کمتر از 1.0 باشد"],
        set: val => Math.round(val * 10) / 10

    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,

    },
    priceDiscount: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        required: [true, "تور باید توضیحات داشته باشد"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "تور باید عکس پس زمینه داشته باشد"],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [{
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    }],
    //Embeded Relation Between tours And Users
    //!guides:Array
    // Child Refrencing Between Tours And Users
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

tourSchema.index({
    price: 1,
    ratingsAverage: -1
})
tourSchema.index({
    startLocation: "2dsphere"
})
// Papulate Reviews For Tours (Reviews Not Saved On Database For Each Tour!!)
tourSchema.virtual('reviews', {
    ref: 'Reviews',
    foreignField: 'tour',
    localField: '_id'
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})


tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: '-__v -passwordChangedAt -active'
    })

    next()
})

//! Refrence Code For Embeded Relation between Tour and Users
//* tourSchema.pre("save" ,async function(next){

//*   const promissesGuide =  this.guides.map(async id => await User.findById(id))
//*  this.guides = await Promise.all(promissesGuide)  
//*     next()
//* })
//! **************************

const Tours = mongoose.model("Tour", tourSchema)

module.exports = Tours
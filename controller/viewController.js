const Tour = require("../model/tourSchema");
const User = require("../model/userSchema");
const AppError = require("../utils/appErrors");
const catchasync = require("../utils/cathAsync")

exports.MainPage = catchasync(async (req, res, next) => {
    const tours = await Tour.find();
    res.status(200).render("base", {
        pageTitle: "Natours",
        path: "/overview",
        layout: "./layouts/mainlayout",
        tours,
    })
})
exports.detailTour = catchasync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate({
        path: "reviews",
        fields: "user rating review"
    })
    if (!tour) {
        return next(new AppError('there is no tour with this id', 404))
    }
    res.status(200).render("tourDetails", {
        pageTitle: `Natours | ${tour.name} Tour`,
        path: "/tour",
        layout: "./layouts/mainlayout",
        tour,
    })
})

exports.getLogin = (req, res, next) => {

    res.status(200).render("login", {
        pageTitle: "Natours | Login User",
        path: "/login",
        layout: "./layouts/mainlayout",
    })
}

// exports.errController = (req,res)=>{
//     res.status(404).render("error",{
//         pageTitle: "Not Found",
//         path:"*",
//         layout:"./layouts/mainlayout",
//         msg : err.msg
//     })

// }

exports.userAcount = (req, res) => {
    res.render("UserAcount", {
        pageTitle: "My Account",
        path: "/me",
        layout: "./layouts/mainlayout",

    })

}


exports.GetUsers = catchasync(async (req, res, next) => {
    const Users = await User.find()

    res.status(200).render("ManageUsers", {
        pageTitle: "All Users",
        path: "/users",
        layout: "./layouts/mainlayout",
        Users
    })
})
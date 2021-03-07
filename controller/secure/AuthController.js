const jwt = require("jsonwebtoken")
const {
    promisify
} = require("util")
const crypto = require("crypto")

const User = require("../../model/userSchema")
const AppError = require('../../utils/appErrors')
const catchAsync = require('../../utils/cathAsync')
const Email = require("../../utils/emailConfiguration") 



// Create JWT Function 
const signToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Create Send Token and Cookie Function !
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),

        httpOnly: true

    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions)
    res.status(statusCode).json({
        status: "success",
        token,
    })

}



// Handlle SignUp

exports.signUp = catchAsync(async (req, res, next) => {
    
    const newUser = await User.create(req.body)
    
    // send welcome email 
    const url = `${req.protocol}://${req.get("host")}/login`
    await new Email(newUser,url).sendWelcome()
    
    //Create Token For User with Jwt
    createSendToken(newUser, 201, res)

})

// Handle Login !

exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body
    //check if email or password entered
    if (!email || !password) {
        return next(new AppError("لطفا ایمیل و رمز عبور خود را وارد کنید"))
    }
    // Find User in database with email 
    const user = await User.findOne({
        email
    }).select('+password')

    //check user exist and password is Correct !
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('email or passsword is Incorrect!'))
    }

    createSendToken(user, 200, res)
})

exports.logOut = (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        status: "success"
    })
}


// Protect Our Routes 
exports.protect = catchAsync(async (req, res, next) => {
    
    let token
    //check token 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token)
        return next(new AppError('you are not logged in !', 401))
    // check  verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //check if user no longer exist
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError("this user no longer exist!", 401))
    }

    //check if Password Changed ! 
    if (currentUser.passwordChangedAfter(decoded.iat)) {
        return next(new AppError("Password was Changed Please Relog in ", 401))
    }

    //Grant access if All Conditions true !
    req.user = currentUser 
    res.locals.user = currentUser // for access to user in rendered Pages
    next()
})

// This is for rendered pages (No errors!) 
exports.ifLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

            //check if user no longer exist
            const currentUser = await User.findById(decoded.id)
            if (!currentUser) {
                return next()
            }

            //check if Password Changed ! 
            if (currentUser.passwordChangedAfter(decoded.iat)) {
                return next()
            }

            //Grant access if All Conditions true !
            res.locals.user = currentUser
            return next()
        } else {
            res.locals.user = ""
        }
        
    } catch (err) {
        res.locals.user = ""
        return next()
    }
    next()
}


// Set Access Roles For Admin Panel 
exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new AppError("شما اجازه دسترسی به این قسمت را ندارید!", 403))
        }
        next()
    }

}
// Desc : Handlle User Forgot Password
exports.ForgotPassword = catchAsync(async (req, res, next) => {


    // First Step = Finde User By POSTed Email
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        return next(new AppError("کاربری با این ایمیل وجود ندارد!", 404))
    }

    // Set Resset Token Password (!!!this is not jwt!!!) With Crypto Mudole !
    const resetToken = user.setPasswordResetToken();
    await user.save({
        validateBeforeSave: false
    })

    // Send Token To User With Email 

    const resetUrl = `${req.protocol}//:${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
     try {
          new Email(user,resetUrl).sendResetPassword()
 
            res.status(200).json({
             status: "success",
             message: "لینک مورد نظر برای ایمیل شما ارسال شد"
         })

     } catch (err) {
         console.log(err);
         user.passwordResetToken = undefined
         user.passwordResetTimer = undefined
         await user.save({
             validateBeforeSave: false
         })
         return next(new AppError("مشکلی به وجود آمده لطفا مجددا تلاش نمایید", 500))
     }
})
exports.ResetPassword = catchAsync(async (req, res, next) => {
    // Find User In Database By Hashed Token 
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTimer: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new AppError("لینک معتبر نیست یا منقضی شده است لطفا مجدد تلاش کنید", 400))
    }
    // 2) Set New Password For User
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTimer = undefined
    await user.save()

    createSendToken(user, 201, res)
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Find User With Id (avalable in protected midllware) 
    const user = await User.findById(req.user.id).select('+password')

    // 2) Check If Current Password Is true
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("کلمه عبور صحیح نمیباشد"))
    }
    // 3) Set New Password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    
    // Login User With New token 
    createSendToken(user, 201, res)
   
})
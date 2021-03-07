const AppError = require("../utils/appErrors")

const handleCastErrorDB = err => {
    const message = `داده اشتباه ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicate = err => {
    const message = `${err.keyValue.name} is duplicate`
    return new AppError(message, 400)
}

const handleValidationErr = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Inavalid inpute Data.${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJwtError = () => new AppError("there is problem !, Please login again", 401)

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        })
    }
    // This is for rendered Website (Show errors with Renderd Page)
    if (err.name == "CastError" || "MongooseError") {
        console.log(err.message);
        return res.status(err.statusCode).render("error", {
            pageTitle: "Error",
            layout: "./layouts/mainlayout",
            message: err.message,
            err

        })
       
    }
}
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOprational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        }
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: 'مشکلی رخ داده است لطفا مجددا تلاش کنید...',
        })


    }
    // This is for rendered Website (Show errors with Renderd Page)
    console.log(err);
    if (err.isOprational) {
         
        return res.status(err.statusCode).render("error", {
            pageTitle: "Error",
            layout: "./layouts/mainlayout",
            message: err.message,
            err

        })
    }
    return res.status(err.statusCode).render("error", {
        pageTitle: "Error",
        layout: "./layouts/mainlayout",
        message: "Try Again Later",

    })
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500,
        err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)

    } else if (process.env.NODE_ENV === 'production') {
        let error = {
            ...err
        }
        
        if (err.name == "CastError") {
            error = handleCastErrorDB(error)
            sendErrorProd(error, req, res)
        } else if (err.code == 11000) {
            error = handleDuplicate(error)
            sendErrorProd(error, req, res)
        } else if (err.name == "ValidationError") {
            error = handleValidationErr(error)
            sendErrorProd(error, req, res)
        } else if (err.name == "JsonWebTokenError") {
            error = handleJwtError()
            sendErrorProd(error, req, res)
        } else {
            sendErrorProd(err, req, res)
        }

    }
}
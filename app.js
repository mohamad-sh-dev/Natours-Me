const path = require("path")

const express = require("express");

const morgan = require("morgan")
const DotEnv = require("dotenv")
const exprLayyout = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")

const app = express()



const Connectiondb = require("./config/Database");
const ErrorGlobal = require("./controller/errorCotroller");


//Dotenv 
DotEnv.config({
    path: "./config/config.env"
})

//Database 
Connectiondb()

// cors (block content security policy)



//Set Engine
app.use(exprLayyout)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "./layouts/mainlayout.ejs")

app.use(helmet({contentSecurityPolicy:false}))

//morgan
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Limit Request From Same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "درخواست بیش از حد مجاز"
})
app.use("/api", limiter)

//body-parser

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Serve Static Folder 

app.use(express.static(path.join(__dirname, "public")))

// Data Sanitize against NOSQL query injection
app.use(mongoSanitize())

// Data Sanitize Against Xss
app.use(xss())

// Perevent Parametr Poulution 
app.use(hpp({
    whitelist: ["duration", "ratingsAverage", "ratingsQuantity", "maxGroupSize", "difficulty"]
}))

//routes

app.use("/api/v1/tours", require("./routes/toursroutes"))
app.use("/api/v1/reviews", require("./routes/reviewRoutes"))
app.use("/api/v1/users", require("./routes/userRoutes"))
app.use("/api/v1/payment", require("./routes/paymentRouts"))
app.use("/", require('./routes/viewsRoutes'))

//404 route
app.use("", require("./routes/MainRoutes"))
app.use(ErrorGlobal)


//Server

port = process.env.PORT
app.listen(port, console.log(`Server Is runing on port ${port} on ${process.env.NODE_ENV} mode`))

//unhandled rejection

process.on("unhandledRejection", err => {
    console.log(`BOOM Error ${err.name}`);
    process.exit(1);
})
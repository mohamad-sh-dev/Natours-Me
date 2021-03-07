const catchAsync = require("../utils/cathAsync")
const multer = require("multer")
const sharp = require("sharp")

// Counfig Multer 


// Set Storage To MemoryStorage Who Access In Sharp As Buffer To Change Image Size 
const multerStorage = multer.memoryStorage()

// set filter for files who user include (just Images)
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image"))
        callback(null, true)
    else callback(new AppError("Please Just Images Formated!!", 400), false)
}

// config multer
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// single method for single photo
exports.uploadPhoto = upload.single("photo")

// Resize Photo User With Sharp Module !
exports.resizeUserPhoto = async (req, res, next) => {
    if (!req.file) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(128, 128).toFormat("jpeg").jpeg({
        quality: 90
    }).toFile(`I:/Programing/Programing/NodeJs/Project/First/public/img/users/${req.file.filename}`)
    next()
}

// fields method for arrays 
exports.uploadTourPhoto = upload.fields([{
    // set names and counts of propertys 
        name: 'imageCover',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 3
    }
])

// resize tour photo Handller
exports.resizeTourPhoto = catchAsync(async (req, res, next) => {
    // check for if imageCover and images are exist !
    if (!req.files.imageCover || !req.files.images) return next()

    // 1) Handlle ImageCover
        // 1-1) set filename field for imageCover 
    req.files.imageCover.filename = `tour-${req.params.id}-${Math.floor(Math.random() * 1000 ) }-${Date.now()}-cover.jpeg`
        // 1-2) Change size of photo usein sharp 
    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
        quality: 90
    }).toFile(`I:/Programing/Programing/NodeJs/Project/First/public/img/tours/${req.files.imageCover.filename}`);
        // 1-3) set imageCover.filename to req.body.imageCover
    req.body.imageCover = req.files.imageCover.filename

    // 2) Handlle Images
        // 2-1) set images to empty array (exist in our tourSchema)
    req.body.images = []
        // 2-2) set name of image file and save image with sharp 
    await Promise.all(req.files.images.map(async (file, i) => { // this method return 3 promises and we await for all promises
        const filename = `tour-${req.params.id}-${req.files.imageCover.filename.split("-")[2]}-${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({
            quality: 90
        }).toFile(`I:/Programing/Programing/NodeJs/Project/First/public/img/tours/${filename}`)
        // 2-3) push images to image array
        req.body.images.push(filename)
    }))
    // next to nextMiddleware
    next()
})
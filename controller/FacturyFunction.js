
const AppError = require("../utils/appErrors")
const catchAsync = require('../utils/cathAsync')
const ApiFeatures = require('../utils/apiFeatures')

// Send Response Function
const SendRes = (data,statusCode,res)=>{
    
    res.status(statusCode).json({
        status: "Success",
        Result: data.length,
        data : data
    })
}

exports.getAll = Model => catchAsync(async (req, res) => {
    // Little Hack For Nested Routs (Finde Review On Tour /api/tourID/review)
    let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId}
    const features = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

    const doc = await features.query
    SendRes(doc,200,res)
});

exports.creatrOne = Model=>  catchAsync(async (req, res,next) => {
    const NewDoc = await Model.create(req.body);
    SendRes(NewDoc,201,res)
});


exports.getOne = (Model,popOptions)=> catchAsync(async (req, res,next) => {
    let query = Model.findById(req.params.id)
    if(popOptions){
        query = query.populate(popOptions)
    }
    const doc = await query
    if(!doc){
        return next(new AppError("هیچ موردی با این شناسه پیدا نشد",404))
    }
    
    SendRes(doc,200,res)
});



exports.deleteOne = Model=> catchAsync(async (req, res,next) => {
    const doc =  await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError("هیچ موردی با این شناسه پیدا نشد",404))
     }

   SendRes(doc,204,res)

});

exports.updateOne = Model => catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc){
       return next(new AppError("هیچ موردی با این شناسه پیدا نشد",404))
    }
    SendRes(doc,200,res)
});

const User = require("../model/userSchema");
const AppError = require("../utils/appErrors");
const cathAsync = require("../utils/cathAsync");
const Fuctory = require("../controller/FacturyFunction")


// Get / Find / Create / Update / Delete User (Just Admin !!!!)

exports.getAllUsers = Fuctory.getAll(User)
exports.FindUserbyID = Fuctory.getOne(User)
exports.UpadateUser = Fuctory.updateOne(User)
exports.DeleteUser = Fuctory.deleteOne(User)


// function For allowed Fields On update User Data (UpdateMe) ! 
const filterObj = (obj , ...allowedfields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el=>{
        if(allowedfields.includes(el)){
            newObj [el] = obj [el]
        }
    })
    return newObj
}

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id
    next()
}

// Find User And Update His Data (Name,Email) ! Just User!!!!

exports.UpdateMe = cathAsync(async(req,res,next)=>{

    if(req.body.password || req.body.passwordConfirm){
        return next (new AppError("از این قسمت نمیتوانید رمز عبور خود را تغییر دهید",400))
    }
    const filteredBody = filterObj(req.body, "name","email")
    if(req.file) filteredBody.photo = req.file.filename
    const Updateduser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new : true,
        runValidators:true
    })
    res.status(200).json({
        status: "success",
        user :  Updateduser,
        
    })
})

// Just For User Who Want Delete His Acounts (Just User!!!)
exports.deleteMe = cathAsync(async(req,res,next)=>{
    
    const user = await User.findByIdAndUpdate(req.user.id,{active:false})
    
    res.status(204).json({
        status: "success",
    })
    
})


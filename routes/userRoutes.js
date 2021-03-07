const {
    Router
} = require("express")
const router = Router()

const {
    getAllUsers,
    FindUserbyID,
    UpadateUser,
    UpdateMe,
    deleteMe,DeleteUser, getMe
} = require("../controller/UsersController")
const {
    signUp,
    login,
    protect,
    restrictTo,
    ForgotPassword,
    ResetPassword,
    updatePassword,
    logOut,
} = require('../controller/secure/AuthController')

const {uploadPhoto,resizeUserPhoto} = require("../controller/photoController")




// Desc :  Users
// Methods : Get / POST / PATCH / Delete


// signUp Request
router.post('/Signup', signUp)

// Login Request
router.post('/Login', login)

// Logout Request
router.get("/logout" , logOut )

// Get All Users Request (Just For Admin)
router.get('/', protect, restrictTo("admin"), getAllUsers)

// Get Cuurent User data Request
router.get('/me',protect,getMe,FindUserbyID)

// Get A User By Id Request (Just For Admin)
router.get('/:id', protect,restrictTo("admin"),FindUserbyID)

router.patch('/updatemyPassword', protect, updatePassword)

router.patch('/updateUser/:id', protect, restrictTo("admin"), UpadateUser)

router.post('/forgotPassword', ForgotPassword)

router.patch('/resetPassword/:token', ResetPassword)
 
router.patch('/UpdateMe',protect,uploadPhoto,resizeUserPhoto, UpdateMe)

router.delete('/deleteMe', protect, deleteMe)

router.delete('/deleteUser/:id',protect,restrictTo("admin"),DeleteUser)

module.exports = router;
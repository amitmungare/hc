const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Aadhar = require("../models/aadharCardModel");
const Report = require("../models/reportModel");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

// register a user 
exports.registerUser = catchAsyncErrors(async(req, res, next) => {

    const {addharnumber, password} = req.body;
    
    const aadharverify = await Aadhar.findOne({ addharnumber : req.body.addharnumber });
    if (!aadharverify) {
        return next(new ErrorHander("aadhar card not found", 404));
    }

    const usersaddhar = await User.findOne({addharnumber});
    if(usersaddhar){
        return next(new ErrorHander("addhar card already registered", 401));
    }

// health id 


    
    const user = await User.create({
        name : aadharverify.name,
        addharnumber,
        email: aadharverify.email,
        password,
        dob : aadharverify.dob,
        gender : aadharverify.gender,
        phoneno : aadharverify.phoneno,
        address : aadharverify.address,
        pincode : aadharverify.pincode
    });

    sendToken(user, 201, res);
});

// login user 
exports.loginUser = catchAsyncErrors(async(req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHander("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});


// logout User 

exports.logout = catchAsyncErrors(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "logged out"
    });
});




// get user detail
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});



// update user profile
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.getMyReport = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.user.id);

    if(!user){
        return next(new ErrorHander("Please login", 400));
    }

    checkemail = user.email;

    const report = await Report.find({ email:checkemail }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        return data;
      }
    });

    res.status(200).json({
      success: true,
      report,
    });


});
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Aadhar = require("../models/aadharCardModel");
const Report = require("../models/reportModel");
const Counter = require("../models/counterModel");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const cloudinary = require("cloudinary");


// register a user 
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { addharnumber, password, } = req.body;

    const aadharverify = await Aadhar.findOne({ addharnumber: req.body.addharnumber });
    if (!aadharverify) {
        return next(new ErrorHander("aadhar card not found", 404));
    }

    const usersaddhar = await User.findOne({ addharnumber });
    if (usersaddhar) {
        return next(new ErrorHander("addhar card already registered", 401));
    }

    // health id 

    const counternumber = await Counter.findById("62eed7bf89d688717d112186"); //counter number id(do not change)
    const num = counternumber.counter + 1;

    const newcounter = {
        counter: num
    }
    await Counter.findByIdAndUpdate("62eed7bf89d688717d112186", newcounter, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    const user = await User.create({
        name: aadharverify.name,
        healthID: num,
        addharnumber,
        email: aadharverify.email,
        password,
        dob: aadharverify.dob,
        gender: aadharverify.gender,
        phoneno: aadharverify.phoneno,
        address: aadharverify.address,
        pincode: aadharverify.pincode
    });

    sendToken(user, 201, res);
});

// login user 
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

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

    console.log(user);

    sendToken(user, 200, res);
});


// logout User 

exports.logout = catchAsyncErrors(async (req, res, next) => {
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
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});



// update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

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


// get all reports of user 
exports.getMyAllReport = catchAsyncErrors(async(req, res, next) => {

    const {id}  = req.body

    console.log(id)

    const user = await User.findById(id);

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



exports.getMyReport = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHander("Please login", 400));
    }

    const reportId = req.body.reportId

    const obj = await Report.findById(reportId);

    if (obj == null) {
        return next(new ErrorHander("not found", 404));
    }

    // decrypt 
    const algorithm = 'aes-256-cbc'
    const key = "adnan-tech-programming-computers" // must be of 32 characters
    const iv = crypto.randomBytes(16)


    const origionalData = Buffer.from(obj.iv, 'base64')

    const decipher = crypto.createDecipheriv(algorithm, key, origionalData);
    let decryptedData = decipher.update(obj.encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    
    res.status(200).json({
        success: true,
        obj,
        decryptedData
    });


});
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Doctor = require("../models/doctorModel");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

// register a doctor 
exports.registerDoctor = catchAsyncErrors(async(req, res, next) => {

    const {name, email, password} = req.body;

    const doctor = await Doctor.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicurl"
        }
    });

    sendToken(doctor, 201, res);
});

// login doctor 
exports.loginDoctor = catchAsyncErrors(async(req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHander("Please enter email and password", 400));
    }

    const doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await doctor.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(doctor, 200, res);
});


// logout doctor 

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




// get doctor detail
exports.getDoctorDetails = catchAsyncErrors(async(req, res, next) => {

    const doctor = await Doctor.findById(req.doctor.id);
    res.status(200).json({
        success: true,
        doctor
    });
});



// update doctor profile
exports.updateDoctorProfile = catchAsyncErrors(async(req, res, next) => {

    const newDoctorData = {
        name: req.body.name,
        email: req.body.email,
    }

    const doctor = await Doctor.findByIdAndUpdate(req.doctor.id, newDoctorData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});
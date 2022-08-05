const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Doctor = require("../models/doctorModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

// register a doctor 
exports.registerDoctor = catchAsyncErrors(async(req, res, next) => {

    const {dname, demail, dpassword} = req.body;

    const doctor = await Doctor.create({
        dname,
        demail,
        dpassword
    });

    sendToken(doctor, 201, res);
});

// login doctor 
exports.loginDoctor = catchAsyncErrors(async(req, res, next) => {

    const { demail, dpassword } = req.body;

    if (!demail || !dpassword) {
        return next(new ErrorHander("Please enter email and password", 400));
    }

    const doctor = await Doctor.findOne({ demail }).select("+dpassword");

    if (!doctor) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await doctor.comparePassword(dpassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or passwords", 401));
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
        dname: req.body.dname,
        demail: req.body.demail,
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



// making report 
exports.createReport = catchAsyncErrors(async(req, res, next) => {

    const {report} = req.body;

    const doctor = await Doctor.findById(req.doctor.id);
    
    const user = await User.findOne({ addharnumber : req.body.addharnumber });
    if (!user) {
        return next(new ErrorHander("aadhar card not found", 404));
    }

    
    const reportcreate = await Report.create({

        name:user.name,
        addharnumber:user.addharnumber,
        email:user.email,
        dname:doctor.dname,
        demail:doctor.demail,
        report:report

    });

    sendToken(reportcreate, 201, res);
});
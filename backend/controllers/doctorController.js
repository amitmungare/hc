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

    const {dname,dregNumber,dyearReg,stateMedicalCouncil, demail, dpassword} = req.body;

    const doctor = await Doctor.create({
        dname,
        dregNumber,
        dyearReg,
        stateMedicalCouncil,
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

    if(doctor.status==false){
        return next(new ErrorHander("Doctor is not verified", 401));
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

    const {report , reportname} = req.body;

    // encrypt 
    const algorithm = 'aes-256-cbc'
    const key = "adnan-tech-programming-computers" // must be of 32 characters
    const iv = crypto.randomBytes(16)


    const message = report;
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    const base64data = Buffer.from(iv, 'binary').toString('base64');

        

// find doctor 
    const doctor = await Doctor.findById(req.doctor.id);
    
    const user = await User.findOne({ addharnumber : req.body.addharnumber });
    if (!user) {
        return next(new ErrorHander("aadhar card not found", 404));
    }

    
    const reportcreate = await Report.create({
        reportname:reportname,
        name:user.name,
        healthID:user.healthID,
        addharnumber:user.addharnumber,
        email:user.email,
        dname:doctor.dname,
        demail:doctor.demail,
        iv: base64data,
        encryptedData: encryptedData

    });


    res.status(201).json({
        success: true,
        reportcreate,
    });


});
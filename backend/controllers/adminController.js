const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Doctor = require("../models/doctorModel");
const Admin = require("../models/adminModel");
const sendToken = require("../utils/jwtToken");
const crypto = require('crypto');
const cloudinary = require("cloudinary");

// register a user 
exports.registerAdmin = catchAsyncErrors(async (req, res, next) => {

    const { idNumber, password, } = req.body;

    const adminverfy = await Admin.findOne({ idNumber });
    if (adminverfy) {
        return next(new ErrorHander("admin already registered", 401));
    }

    const admin = await Admin.create({
        idNumber,
        password,
    });

    sendToken(admin, 201, res);
});


// login admin 
exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {

    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
        return next(new ErrorHander("Please enter idNumber and password", 400));
    }

    const admin = await Admin.findOne({ idNumber }).select("+password");

    if (!admin) {
        return next(new ErrorHander("Invalid admin or password", 401));
    }

    const isPasswordMatched = await admin.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid admin or password", 401));
    }

    sendToken(admin, 200, res);
});



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



// update doctor 
exports.updateDoctor = catchAsyncErrors(async(req, res, next) => {

    const {demail, status} = req.body

    const newDoctorData = {
        status:status
    }

    const doctor = await Doctor.findOneAndUpdate({demail:demail}, newDoctorData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    if (!doctor) {
        return next(
          new ErrorHander(`doctor dose not exist with email: ${demail}`, 400)
        );
      }

    res.status(200).json({
        success: true,
    });
});

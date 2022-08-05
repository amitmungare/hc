const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");

exports.isAuthenticatedDoctor = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.doctor = await Doctor.findById(decodedData.id);

    next();
});
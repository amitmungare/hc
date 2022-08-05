const express = require("express");
const router = express.Router();
const {
    registerDoctor,
    loginDoctor,
    logout,
    getDoctorDetails,
    updateDoctorProfile,
    createReport
} = require("../controllers/doctorController");


const { isAuthenticatedDoctor } = require("../middleware/authDoctor");

router.route("/register").post(registerDoctor);

router.route("/login").post(loginDoctor);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedDoctor, getDoctorDetails);

router.route("/me/update").put(isAuthenticatedDoctor, updateDoctorProfile);

router.route("/doctor/createreport").post(isAuthenticatedDoctor, createReport);




module.exports = router;
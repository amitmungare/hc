const express = require("express");
const router = express.Router();
const {
    registerDoctor,
    loginDoctor,
    logout,
    getDoctorDetails,
    updateDoctorProfile
} = require("../controllers/doctorController");


const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register").post(registerDoctor);

router.route("/login").post(loginDoctor);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getDoctorDetails);

router.route("/me/update").put(isAuthenticatedUser, updateDoctorProfile);




module.exports = router;
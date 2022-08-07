const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logout,
    getUserDetails,
    updateProfile,
    getMyAllReport,
    getMyReport
} = require("../controllers/userController");


const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/me/allreport").get(isAuthenticatedUser, getMyAllReport);

router.route("/me/report").post(isAuthenticatedUser, getMyReport);



module.exports = router;
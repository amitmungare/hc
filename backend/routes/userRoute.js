const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logout,
    getUserDetails,
    updateProfile,
} = require("../controllers/userController");


const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);




module.exports = router;
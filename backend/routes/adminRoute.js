const express = require("express");
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    logout,
    updateDoctor
} = require("../controllers/adminController");


const { isAuthenticatedUser } = require("../middleware/auth");

// router.route("/register").post(registerAdmin);

router.route("/login").post(loginAdmin);

router.route("/logout").get(logout);

router.route("/updateDoctor").put(isAuthenticatedUser,updateDoctor);

module.exports = router;
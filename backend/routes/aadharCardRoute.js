const express = require("express");
const router = express.Router();
const {
    registeraadhar
} = require("../controllers/aadharCardController");

router.route("/aadharregister").post(registeraadhar);

module.exports = router;
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const reportSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    addharnumber: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: validator.isEmail
    },
    dname: {
        type: String,
        required: true
    },
    demail: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail
    },
    report:{
        type:String,
        required: true
    }

});



reportSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
reportSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


// compare password
reportSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// password reset token 
reportSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}



module.exports = mongoose.model("Report", reportSchema);
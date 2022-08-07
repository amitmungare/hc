const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const doctorSchema = new mongoose.Schema({

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
    dpassword: {
        type: String,
        required: true
    }

});

doctorSchema.pre("save", async function(next) {
    if (!this.isModified("dpassword")) {
        next();
    }
    this.dpassword = await bcrypt.hash(this.dpassword, 10);
});

// jwt token
doctorSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


// compare password
doctorSchema.methods.comparePassword = async function(dpassword) {
    return await bcrypt.compare(dpassword, this.dpassword);
}

// password reset token 
doctorSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}



module.exports = mongoose.model("Doctor", doctorSchema);
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middleware/error");



app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


// route import
const user = require("./routes/userRoute");
const doctor = require("./routes/doctorRoute");
const aadharcard = require("./routes/aadharCardRoute");
const admin = require("./routes/adminRoute")

app.use("/api/v1", user);
app.use("/api/v1/doctor", doctor);
app.use("/api/v1", aadharcard);
app.use("/api/v1/admin", admin);

// middleware for error 
app.use(errorMiddleware);

module.exports = app;
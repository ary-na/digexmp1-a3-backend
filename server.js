// @file    ./server.js

// Dependencies ----------------------------------------------------------------
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 3000;
const fileUpload = require("express-fileupload");

// Database connection ---------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("db connected!");
    }, err => {
        console.log("db connection failed!", err);
    });

// Express app setup -----------------------------------------------------------
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("*", cors());
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024}
}));

// Setup routes ----------------------------------------------------------------

// - User route
const userRouter = require("./routes/user");
app.use('/user', userRouter);

// - Auth route
const authRouter = require("./routes/auth");
app.use('/auth', authRouter);

// Run app (Listen on port) ----------------------------------------------------
app.listen(port, () => {
    console.log(`The app is running on port ${port}.`);
});
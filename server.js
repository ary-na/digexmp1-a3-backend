// @file    ./server.js

// Dependencies ----------------------------------------------------------------
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const port = process.env.PORT || 3000
const fileUpload = require("express-fileupload")

// Database connection ---------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("db connected!")
    }, err => {
        console.log("db connection failed!", err)
    })

// Express app setup -----------------------------------------------------------
const app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("*", cors())
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024}
}))

// Setup routes ----------------------------------------------------------------

// - Homepage route
const homeRouter = require("./routes/home")
app.use('/', homeRouter)

// - Auth route
const authRouter = require("./routes/auth")
app.use('/auth', authRouter)

// - User route
const userRouter = require("./routes/user")
app.use('/user', userRouter)

// - Drink route
const drinkRouter = require("./routes/drink")
app.use('/drink', drinkRouter)

// - Order route
const orderRouter = require("./routes/order")
app.use('/order', orderRouter)

// Run app (Listen on port) ----------------------------------------------------
app.listen(port, () => {
    console.log(`The app is running on port ${port}.`)
})
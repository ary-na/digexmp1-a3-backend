// @file    ./routes/auth.js

// Setup dependencies for auth routes.
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Utils = require("../Utils");
const express = require("express");
const router = express.Router();

// POST ------------------------------------------------------------------------
// @route   /login
// @desc    Login.
// @access  Public
router.post('/login', async (req, res) => {

    // Check if an email or a password is not provided.
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "email or password is missing!"
        })
    }

    // Find user in the database using the email filter.
    await User.findOne({email: req.body.email})
        .then(async user => {
            // Check if user does not exist.
            if (!user) {
                return res.status(400).json({
                    message: "user not found!"
                })
            }

            // Check if provided password is correct.
            if (Utils.verifyPassword(req.body.password, user.password)) {

                // Create a JWT token on passwords matched.
                let userObject = { _id: user._id }

                // Generate a jsonwebtoken access token.
                let accessToken = Utils.generateAccessToken(userObject)

                // Set password field to undefined.
                user.password = undefined

                await res.json({
                    accessToken: accessToken,
                    user: user
                })
            } else {
                return res.status(400).json({
                    message: "incorrect password or email!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error signing in!",
                error: err
            })
            console.log(err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /validate
// @desc    Validate Login.
// @access  Public
router.get('/validate', async (req, res) => {

    // Check if header is missing.
    if (!req.headers.authorization) {
        return res.status(400).json({
            message: "authorization token is missing!"
        });
    }

    // Get authorization token from the header.
    const token = req.headers.authorization.split(" ")[1];

    // Decrypt and validate the authorization token.
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
        // Check if the token is not valid.
        if (err) {
            console.log(err);
            return res.status(401).json({
                message: "unauthorized"
            })
        }

        User.findById(tokenData.user._id)
            .then(user => {
                // Set password field to undefined.
                user.password = undefined
                res.json({
                    user: user
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: "error validating token!",
                    error: err
                })
                console.log(err)
            })
    })
})

// Export the router object as a module.
module.exports = router;
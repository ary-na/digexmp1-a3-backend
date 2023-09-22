// @file    ./routes/api/auth.js

// Setup dependencies for auth routes.
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("./../../models/User");
const Utils = require("./../../Utils");
const express = require("express");
const router = express.Router();

// POST ------------------------------------------------------------------------
// @route   /signin
// @desc    Sign in.
// @access  Public
router.post('/signin', (req, res) => {

    // Check if an email or a password is not provided.
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "email or password is missing!"
        });
    }

    // Find user in the database using the email filter.
    User.findOne({email: req.body.email})
        .then(user => {
            // Check if user does not exist.
            if (!user) {
                return res.status(400).json({
                    message: "user not found!"
                });
            }

            // Check if provided password is correct.
            if (Utils.verifyPassword(req.body.password, user.password)) {

                // Create user object without password and unnecessary properties.
                const userObject = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    bio: user.bio
                };

                // Generate a jsonwebtoken access token.
                const accessToken = Utils.generateAccessToken(userObject);

                res.json({
                    accessToken: accessToken,
                    user: userObject
                });
            } else {
                return res.status(400).json({
                    message: "incorrect password or email!"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error signing in!",
                error: err
            });
            console.log(err);
        });
});

// GET -------------------------------------------------------------------------
// @route   /validate
// @desc    Validate sign in.
// @access  Public
router.get('/validate', (req, res) => {

    if (!req.headers.authorization) {
        return res.status(400).json({
            message: "authorization token is missing!"
        });
    }

    // Get authorization token from the header.
    const token = req.headers.authorization.split(" ")[1];

    // Decrypt and validate the authorization token.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => {
        // Check if the token is not valid.
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        } else {
            return res.json({
                tokenData: tokenData
            });
        }
    });
});

// Export the router object as a module.
module.exports = router;
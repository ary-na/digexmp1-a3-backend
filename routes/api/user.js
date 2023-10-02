// @file    ./routes/api/user.js

// Setup dependencies for user routes.
const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const Utils = require("./../../Utils");
const path = require("path");
const {raw} = require("express");

// GET -------------------------------------------------------------------------
// @route   /user
// @desc    Get all users.
// @access  Private
router.get('/', Utils.authenticateToken, async (req, res) => {
    // Get all users from the User model.
    await User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: "error finding user!",
                error: err
            });
            console.log("error finding user!", err);
        });
});

// GET -------------------------------------------------------------------------
// @route   /user/:id
// @desc    Get a user by id.
// @access  Private
router.get('/:id', Utils.authenticateToken, async (req, res) => {

    if (req.user._id !== req.params.id) {
        return res.status(401).json({
            message: "unauthorized"
        });
    }

    await User.findById(req.params.id)
        .then(async user => {
            // Check if user exist in the db.
            if (!user) {
                await res.status(404).json({
                    message: "user not found!"
                });
            } else {
                await res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error finding user!",
                error: err
            });
            console.log("error finding user!", err);
        });
});

// POST ------------------------------------------------------------------------
// @route   /user
// @desc    Create a new user.
// @access  Public
router.post('/', async (req, res) => {
    // Check if body is missing.
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.accessLevel) {
        return res.status(400).json({
            message: "Firstname, lastname, email, password, or access level is missing!"
        });
    }

    // Check if user exists.
    await User.findOne({email: req.body.email}).then(async user => {
        if (user) {
            return res.status(400).json({
                message: "user already exists!"
            });
        }

        // Create a new user document using the User model.
        const newUser = await new User(req.body);

        // Save the new user document.
        await newUser.save()
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.json(500).json({
                    message: "error saving user!",
                    error: err
                });
                console.log("error saving user!", err);
            });

    }).catch(err => {
        res.status(500).json({
            message: "error creating user!",
            error: err
        });
        console.error(err);
    });
});

// PUT -------------------------------------------------------------------------
// @route   /user/:id
// @desc    Update a user by id.
// @access  Public
router.put("/:id", Utils.authenticateToken, async (req, res) => {
    // Code source and adapted from:
    // https://stackoverflow.com/questions/42921727/how-to-check-req-body-empty-or-not-in-node-express
    // Check if header/body is missing.
    if (Object.keys(req.body).length === 0 || !req.params.id) {
        return res.status(400).json({
            message: "id or user detail is missing!"
        });
    }

    let avatarFileName = null;

    // Check if avatar file exists
    if (req.files && req.files.avatar) {
        let uploadPath = path.join(__dirname, "..", "public", "images");
        await Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFileName) => {
            avatarFileName = uniqueFileName;
        });
    }

    // Find and update the user using the User model and return the updated user.
    await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(user => {
            // Check if user exist in the db.
            if (!user) {
                res.status(404).json({
                    message: "user not found!"
                });
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error updating user!",
                error: err
            });
            console.log("error updating user!", err);
        });
});

// DELETE ----------------------------------------------------------------------
// @route   /user/:id
// @desc    Delete a user by id.
// @access  Private
router.delete("/:id", Utils.authenticateToken, async (req, res) => {
    // Delete the user using the User model.
    await User.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({
                message: "user deleted!"
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "error deleting user!",
                error: err
            });
            console.log("error deleting user!", err);
        });
});

// Export the router object as a module.
module.exports = router;
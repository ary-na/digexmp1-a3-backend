// @file    ./routes/user.js

// Setup dependencies for user routes.
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Utils = require("../Utils")
const path = require("path")
const {raw, json} = require("express")

// GET -------------------------------------------------------------------------
// @route   /user
// @desc    Get all users.
// @access  Private
router.get('/', Utils.authenticateToken, async (req, res) => {
    // Get all users from the User model.
    await User.find()
        .then(users => {
            res.json(users)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error finding users!",
                error: err
            })
            await console.log("error finding users!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /user/:id
// @desc    Get a user by id.
// @access  Private
router.get('/:id', Utils.authenticateToken, async (req, res) => {

    if (!req.params.id) {
        return res.status(401).json({
            message: "id is missing!"
        })
    }

    await User.findById(req.params.id)
        .populate('favouriteBaristas', '_id firstName lastName avatar bio')
        .populate('favouriteDrinks')
        .populate('cart', '_id name description price user image drinkType')
        .then(async user => {
            // Check if user exist in the db.
            if (!user) {
                await res.status(404).json({
                    message: "user not found!"
                })
            } else {
                await res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error finding user!",
                error: err
            })
            console.log("error finding user!", err);
        })
})

// GET -------------------------------------------------------------------------
// @route   /user/access/:accessLevel
// @desc    Get users by access level.
// @access  Private
router.get('/access/:accessLevel', Utils.authenticateToken, async (req, res) => {
    if (!req.params.accessLevel) {
        return res.status(401).json({
            message: "access level is missing!"
        })
    }

    await User.find({accessLevel: req.params.accessLevel}, {
        _id: 1,
        firstName: 1,
        lastName: 1,
        avatar: 1,
        bio: 1
    })
        .then(async users => {
            // Check if any users with access level exist in the db.
            if (!users) {
                await res.status(404).json({
                    message: "users not found!"
                })
            } else {
                await res.json(users);
            }
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error finding users!",
                error: err
            })
            console.log("error finding users!", err)
        })
})


// POST ------------------------------------------------------------------------
// @route   /user
// @desc    Create a new user.
// @access  Public
router.post('/', async (req, res) => {
    // Check if body is missing.
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.accessLevel) {
        return res.status(400).json({
            message: "Firstname, lastname, email, password, or access level is missing!"
        })
    }

    // Check if user exists.
    await User.findOne({email: req.body.email}).then(async user => {
        if (user) {
            return res.status(400).json({
                message: "user already exists!"
            })
        }

        // Create a new user document using the User model.
        const newUser = await new User(req.body)

        // Save the new user document.
        await newUser.save()
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    message: "error saving user!",
                    error: err
                })
                console.log("error saving user!", err)
            })

    }).catch(err => {
        res.status(500).json({
            message: "error creating user!",
            error: err
        })
        console.error(err)
    })
})

// PUT -------------------------------------------------------------------------
// @route   /user/:id
// @desc    Update a user by id.
// @access  Private
router.put('/:id', Utils.authenticateToken, async (req, res) => {
    // Check if body is missing.
    if (!req.body)
        return res.status(400).send("user details missing!")

    let avatarFilename = null

    // Check if avatar file exists.
    if (req.files && req.files.avatar) {
        // Upload avatar image.
        let uploadPath = path.join(__dirname, '..', 'public', 'images')
        await Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
            avatarFilename = uniqueFilename
            // Update user if avatar file exists.
            updateUser({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                bio: req.body.bio,
                avatar: avatarFilename
            })
        })
    } else {
        // Update user if avatar file does not exist.
        await updateUser(req.body)
    }

    // Find and update the user using the User model and return the updated user.
    async function updateUser(user) {
        User.findByIdAndUpdate(req.params.id, user, {new: true})
            .then(async user => {
                // Check if user exist in the db.
                if (!user) {
                    await res.status(404).json({
                        message: "user not found!"
                    })
                } else {
                    await res.json(user)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "error updating user!",
                    error: err
                })
                console.log("error updating user!", err)
            })
    }
})


// PUT -------------------------------------------------------------------------
// @route   /user/add/favouriteBarista
// @desc    Add a user to favourite barista array.
// @access  Private
router.put('/add/favouriteBarista', Utils.authenticateToken, async (req, res) => {
    // Check if barista id is missing.
    if (!req.body.userId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Add barista id to favourite baristas array using array push.
    await User.updateOne({_id: req.user.user._id}, {
        $addToSet: {favouriteBaristas: req.body.userId}
    })
        .then(async () => {
            await res.json({
                message: "user added to favourites!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error adding barista to favourites!",
                error: err
            })
            console.log(err)
        })
})

// PUT -------------------------------------------------------------------------
// @route   /user/remove/favouriteBarista
// @desc    Remove a user from favourite barista array.
// @access  Private
router.put('/remove/favouriteBarista', Utils.authenticateToken, async (req, res) => {
    // Check if barista id is missing.
    if (!req.body.userId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Remove barista id from favourite baristas array using array pull.
    await User.updateOne({_id: req.user.user._id}, {
        $pull: {favouriteBaristas: req.body.userId}
    })
        .then(async () => {
            await res.json({
                message: "user removed from favourites!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error removing barista from favourites!",
                error: err
            })
            console.log(err)
        })
})

// PUT -------------------------------------------------------------------------
// @route   /user/add/favouriteDrink
// @desc    Add a drink to favourite drinks array.
// @access  Private
router.put('/add/favouriteDrink', Utils.authenticateToken, async (req, res) => {
    // Check if drink id is missing.
    if (!req.body.drinkId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Add drink id to favourite drinks array using array push.
    await User.updateOne({_id: req.user.user._id}, {
        $addToSet: {favouriteDrinks: req.body.drinkId},
    }).exec()
        .then(async () => {
            await res.json({
                message: "drink added to favourites!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error adding drink to favourites!",
                error: err
            })
            console.log(err)
        })
})

// PUT -------------------------------------------------------------------------
// @route   /user/remove/favouriteDrink
// @desc    Remove a drink from favourite drinks array.
// @access  Private
router.put('/remove/favouriteDrink', Utils.authenticateToken, async (req, res) => {
    // Check if drink id is missing.
    if (!req.body.drinkId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Remove drink id from favourite drinks array using array pull.
    await User.updateOne({_id: req.user.user._id}, {
        $pull: {favouriteDrinks: req.body.drinkId}
    })
        .then(async () => {
            await res.json({
                message: "drink removed from favourites!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error removing drink from favourites!",
                error: err
            })
            console.log(err)
        })
})

// PUT -------------------------------------------------------------------------
// @route   /user/add/cart
// @desc    Add a drink to the cart array.
// @access  Private
router.put('/add/cart', Utils.authenticateToken, async (req, res) => {
    // Check if drink id is missing.
    if (!req.body.drinkId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Add drink id to favourite drinks array using array push.
    await User.updateOne({_id: req.user.user._id}, {
        $addToSet: {cart: req.body.drinkId},
    }).exec()
        .then(async () => {
            await res.json({
                message: "drink added to cart!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error adding drink to cart!",
                error: err
            })
            console.log(err)
        })
})

// PUT -------------------------------------------------------------------------
// @route   /user/remove/cart
// @desc    Remove a drink from the cart array.
// @access  Private
router.put('/remove/cart', Utils.authenticateToken, async (req, res) => {
    // Check if drink id is missing.
    if (!req.body.drinkId) {
        return res.status(400).json({
            message: "id is missing!"
        })
    }

    // Remove drink id from cart array using array pull.
    await User.updateOne({_id: req.user.user._id}, {
        $pull: {cart: req.body.drinkId},
    }).exec()
        .then(async () => {
            await res.json({
                message: "drink removed from cart!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error removing drink from cart!",
                error: err
            })
            console.log(err)
        })
})

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
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "error deleting user!",
                error: err
            })
            console.log("error deleting user!", err)
        })
})

// Export the router object as a module.
module.exports = router
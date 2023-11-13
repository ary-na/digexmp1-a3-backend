// @file    ./routes/drink.js

// Setup dependencies for user routes.
const express = require('express')
const router = express.Router()
const Utils = require('../Utils')
const Drink = require('../models/Drink')
const Order = require('../models/Order')
const path = require("path")

// GET -------------------------------------------------------------------------
// @route   /drink
// @desc    Get all drinks.
// @access  Private
router.get('/', Utils.authenticateToken, async (req, res) => {
    // Get all drinks from the Drink model.
    Drink.find().populate('user', '_id firstName lastName')
        .then(async drinks => {
            // Check if drinks exist in the db.
            if (!drinks) {
                return res.status(404).json({
                    message: "drinks not found!"
                })
            }
            await res.json(drinks)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting drinks!",
                error: err
            })
            await console.log("error getting drinks!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /drink/count/:userId
// @desc    Get drink count by user id.
// @access  Private
router.get('/count/:userId', Utils.authenticateToken, async (req, res) => {
    // Get drink count from the Drink model by user id.
    Drink.countDocuments({user: req.params.userId})
        .then(async count => {
            await res.json(count)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error counting drinks!",
                error: err
            })
            await console.log("error counting drinks!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /drink/special
// @desc    Get all special drinks.
// @access  Private
router.get('/special', Utils.authenticateToken, async (req, res) => {
    // Get all specials from the Drink model.
    Drink.find({special: true}).populate('user', '_id firstName lastName')
        .then(async specials => {
            // Check if specials exist in the db.
            if (!specials) {
                return res.status(404).json({
                    message: "specials not found!"
                })
            }
            await res.json(specials)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting specials!",
                error: err
            })
            await console.log("error getting specials!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /drink/:id
// @desc    Get a drink by id.
// @access  Private
router.get('/:drinkId', Utils.authenticateToken, async (req, res) => {
    // Get all drinks from the Drink model.
    Drink.findById(req.params.drinkId)
        .then(async drink => {
            // Check if drink exist in the db.
            if (!drink) {
                return res.status(404).json({
                    message: "drink not found!"
                })
            }
            await res.json(drink)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting drink!",
                error: err
            })
            await console.log("error getting drink!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /drink/by/:userId
// @desc    Get drinks by user id.
// @access  Private
router.get('/by/:userId', Utils.authenticateToken, async (req, res) => {
    // Get all drinks from the Drink model.
    Drink.find({user: {_id: req.params.userId}}).populate('user', '_id firstName lastName')
        .then(async drinks => {
            // Check if drinks exist in the db.
            if (!drinks) {
                return res.status(404).json({
                    message: "drinks not found!"
                })
            }
            await res.json(drinks)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting drinks!",
                error: err
            })
            await console.log("error getting drinks!", err)
        })
})

// POST ------------------------------------------------------------------------
// @route   /drink
// @desc    Create a new drink.
// @access  Private
router.post('/', Utils.authenticateToken, async (req, res) => {
    // Check if body is empty.
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({message: "drink details missing!"})

    // Check if image file exists.
    if (!req.files || !req.files.image) {
        req.body.image = "default-image.jpg"
        req.body.special = true

        // Create a new user document using the User model.
        const newDrink = await new Drink(req.body)

        // Save the new user document.
        await newDrink.save()
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    message: "error saving drink!",
                    error: err
                })
                console.log("error saving drink!", err)
            })
    } else {
        // Upload file and create drink object using Drink model.
        let uploadPath = path.join(__dirname, '..', 'public', 'images')
        await Utils.uploadFile(req.files.image, uploadPath, async (uniqueFilename) => {
            let drink = new Drink({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                user: req.body.user,
                image: uniqueFilename,
                type: req.body.type,
                brewMethod: req.body.brewMethod,
                decaf: req.body.decaf,
                special: true
            })

            await drink.save()
                .then(async drink => {
                    return res.status(201).json(drink)
                })
                .catch(async err => {
                    res.status(500).json({
                        message: "error saving drink!",
                        error: err
                    })
                    console.log("error saving drink!", err)
                })
        })
    }
})

// PUT -------------------------------------------------------------------------
// @route   /drink/:id
// @desc    Update a drink by id.
// @access  Private
router.put('/:id', Utils.authenticateToken, async (req, res) => {
    // Check if body is missing.
    if (!req.body)
        return res.status(400).send("drink details missing!")

    let imageFilename = null

    // Check if image file exists.
    if (req.files && req.files.image) {
        // Upload image.
        let uploadPath = path.join(__dirname, '..', 'public', 'images')
        await Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {
            imageFilename = uniqueFilename
            // Update drink if image file exists.
            updateDrink({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: imageFilename,
                drinkType: req.body.drinkType,
                brewMethod: req.body.brewMethod,
                decaf: !req.body.decaf ? false : req.body.decaf
            })
        })
    } else {
        // Update drink if image file does not exist.
        if (!req.body.decaf)
            req.body.decaf = false
        await updateDrink(req.body)
    }

    // Find and update the drink using the Drink model and return the updated drink.
    async function updateDrink(drink) {
        Drink.findByIdAndUpdate(req.params.id, drink, {new: true})
            .then(async drink => {
                // Check if drink exist in the db.
                if (!drink) {
                    await res.status(404).json({
                        message: "drink not found!"
                    })
                } else {
                    await res.json(drink)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "error updating drink!",
                    error: err
                })
                console.log("error updating drink!", err)
            })
    }
})


// DELETE ----------------------------------------------------------------------
// @route   /drink/:id
// @desc    Delete a drink by id.
// @access  Private
router.delete("/:id", Utils.authenticateToken, async (req, res) => {
    // Delete the drink using the Drink model.
    await Drink.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({
                message: "drink deleted!"
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "error deleting drink!",
                error: err
            })
            console.log("error deleting drink!", err)
        })
})


// Export the router object as a module.
module.exports = router



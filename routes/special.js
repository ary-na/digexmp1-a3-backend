// @file    ./routes/special.js

// Setup dependencies for user routes.
const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Special = require('../models/Special')
const path = require("path")
const User = require("../models/User");

// GET -------------------------------------------------------------------------
// @route   /special
// @desc    Get all specials.
// @access  Private
router.get('/', Utils.authenticateToken, async (req, res) => {
    // Get all specials from the Special model.
    Special.find().populate('user', '_id firstName lastName')
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
// @route   /special/:id
// @desc    Get specials by user id.
// @access  Private
router.get('/:userId', Utils.authenticateToken, async (req, res) => {
    // Get all specials from the Special model.
    Special.find({user: {_id: req.params.userId}}).populate('user', '_id firstName lastName')
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

// POST ------------------------------------------------------------------------
// @route   /special
// @desc    Create a new special.
// @access  Private
router.post('/', Utils.authenticateToken, async (req, res) => {
    // Check if body is empty.
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({message: "special details missing!"})

    // Check if image file exists.
    if (!req.files || !req.files.image)
        return res.status(400).send({message: "image file missing!"})

    // Upload file and create special object using Special model.
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    await Utils.uploadFile(req.files.image, uploadPath, async (uniqueFilename) => {
        let special = new Special({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            user: req.body.user,
            image: uniqueFilename,
            drinkType: req.body.drinkType,
            brewMethod: req.body.brewMethod,
            decaf: req.body.decaf
        })

        await special.save()
            .then(async special => {
                return res.status(201).json(special)
            })
            .catch(async err => {
                res.status(500).json({
                    message: "error saving special!",
                    error: err
                })
                console.log("error saving special!", err)
            })
    })
})


// DELETE ----------------------------------------------------------------------
// @route   /special/:id
// @desc    Delete a special by id.
// @access  Private
router.delete("/:id", Utils.authenticateToken, async (req, res) => {
    // Delete the user using the User model.
    await Special.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({
                message: "special deleted!"
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "error deleting special!",
                error: err
            })
            console.log("error deleting special!", err)
        })
})


// Export the router object as a module.
module.exports = router



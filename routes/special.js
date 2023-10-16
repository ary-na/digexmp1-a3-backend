// @file    ./routes/special.js

// Setup dependencies for user routes.
const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Special = require('../models/Special')

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

// Export the router object as a module.
module.exports = router



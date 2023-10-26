// @file    ./routes/special.js

// Setup dependencies for user routes.
const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Special = require('../models/Special')
const path = require("path");

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

// POST ------------------------------------------------------------------------
// @route   /special
// @desc    Create a new special.
// @access  Private
router.post('/', Utils.authenticateToken, async (req, res) => {
    // validate
    if(Object.keys(req.body).length === 0){
        return res.status(400).send({message: "special content can't be empty"})
    }
    // validate - check if image file exist
    if(!req.files || !req.files.image){
        return res.status(400).send({message: "Image can't be empty"})
    }

    console.log('req.body = ', req.body)

    // image file must exist, upload, then create new haircut
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    await Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {
        // create new haircut
        let special = new Special({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            user: req.body.user,
            image: uniqueFilename,
            gender: req.body.gender,
            length: req.body.length
        })

         special.save()
            .then(async special => {
                // success!
                // return 201 status with user object
                return res.status(201).json(special)
            })
            .catch(async err => {
                console.log(err)
                return res.status(500).send({
                    message: "Problem creating haircut",
                    error: err
                })
            })
    })
})


// Export the router object as a module.
module.exports = router



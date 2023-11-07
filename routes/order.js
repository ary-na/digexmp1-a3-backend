// @file    ./routes/order.js

// Setup dependencies for order routes.
const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Order = require('../models/Order')
const path = require("path")
const User = require("../models/User");


// POST ------------------------------------------------------------------------
// @route   /order
// @desc    Create a new order.
// @access  Private
router.post('/', Utils.authenticateToken, async (req, res) => {

    // Check if body is empty.
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({message: "order details missing!"})

    // Create a new order document using the Order model.
    const newOrder = await new Order(req.body)

    // Push order items to the drinks array.
    for(let i = 0; i < req.body.items.length; i++)
        newOrder.drinks.push({quantity: req.body.quantities[i], _id: req.body.items[i]})

    // Save the new user document.
    await newOrder.save()
        .then(async order => {
            await res.status(201).json(order)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error saving order!",
                error: err
            })
            console.log("error saving order!", err)
        })
})

// Export the router object as a module.
module.exports = router

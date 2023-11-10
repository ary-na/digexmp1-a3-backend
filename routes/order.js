// @file    ./routes/order.js

// Setup dependencies for order routes.
const express = require('express')
const router = express.Router()
const Utils = require('../Utils')
const Order = require('../models/Order')
const path = require("path")
const User = require("../models/User");
const {populate} = require("dotenv");

// GET -------------------------------------------------------------------------
// @route   /order/last/:id
// @desc    Get last order by customer id.
// @access  Private
router.get('/last/:id', Utils.authenticateToken, async (req, res) => {
    // Check if header is missing.
    if (!req.params.id) {
        return res.status(401).json({
            message: "id is missing!"
        })
    }

    // Get last order form the Order model by user id.
    Order.findOne(
        {user: {_id: req.params.id}
    }).sort({date: 'desc'})
        .populate('user', '_id firstName lastName')
        .populate('barista', '_id firstName lastName')
        .populate('drinks._id')
        .then(async order => {
            // Check if order exist in the db.
            if (!order) {
                return res.status(201).json({
                    message: "order not found!"
                })
            }
            await res.json(order)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting order!",
                error: err
            })
            await console.log("error getting order!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /order/customer/:id
// @desc    Get orders by customer id.
// @access  Private
router.get('/customer/:id', Utils.authenticateToken, async (req, res) => {
    // Check if header is missing.
    if (!req.params.id) {
        return res.status(401).json({
            message: "id is missing!"
        })
    }

    // Get orders from the Order model by user id.
    Order.find({
        user: {_id: req.params.id}
    }).populate('user', '_id firstName lastName')
        .populate('barista', '_id firstName lastName')
        .populate('drinks._id')
        .then(async orders => {
            // Check if orders exist in the db.
            if (!orders) {
                return res.status(404).json({
                    message: "orders not found!"
                })
            }
            await res.json(orders)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting orders!",
                error: err
            })
            await console.log("error getting orders!", err)
        })
})

// GET -------------------------------------------------------------------------
// @route   /order/barista/:id
// @desc    Get orders by barista id.
// @access  Private
router.get('/barista/:id', Utils.authenticateToken, async (req, res) => {
    // Check if header is missing.
    if (!req.params.id) {
        return res.status(401).json({
            message: "id is missing!"
        })
    }

    // Get orders from the Order model by barista id.
    Order.find({
        barista: {_id: req.params.id}
    }).populate('user', '_id firstName lastName')
        .populate('barista', '_id firstName lastName')
        .populate('drinks._id')
        .then(async orders => {
            // Check if orders exist in the db.
            if (!orders) {
                return res.status(404).json({
                    message: "orders not found!"
                })
            }
            await res.json(orders)
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error getting orders!",
                error: err
            })
            await console.log("error getting orders!", err)
        })
})

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
    for (let i = 0; i < req.body.items.length; i++)
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

// PUT -------------------------------------------------------------------------
// @route   /order/status
// @desc    Change ready status by order id.
// @access  Private
router.put('/status', Utils.authenticateToken, async (req, res) => {
    // Check if body is missing.
    if (!req.body.orderId || req.body.ready === null) {
        return res.status(400).json({
            message: "body is missing!"
        })
    }

    // Change order status using order id.
    await Order.updateOne({_id: req.body.orderId}, {
        ready: req.body.ready
    })
        .then(async () => {
            await res.json({
                message: "order ready status changed!"
            })
        })
        .catch(async err => {
            await res.status(500).json({
                message: "error changing order ready status!",
                error: err
            })
            console.log(err)
        })
})

// Export the router object as a module.
module.exports = router

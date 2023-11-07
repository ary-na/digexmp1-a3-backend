// @file    ./models/Order.js

// Setup dependencies to create the user model.
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema ---------------------------------------------------------------
const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    ready: {
        type: Boolean,
        default: false
    },
    instructions: {
        type: String,
        required: false
    },
    drinks: [
        {
           _id: {
                type: Schema.Types.ObjectId,
                ref: 'Drink',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {timestamps: true})


// Create mongoose model -------------------------------------------------------
const orderModel = mongoose.model('Order', orderSchema, "orders")

// Export the User model as a module.
module.exports = orderModel


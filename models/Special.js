// @file    ./models/Special.js

// Setup dependencies to create the user model.
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create schema ---------------------------------------------------------------
const specialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    drinkType: {
        type: String,
        required: false
    },
    brewMethod: {
        type: String,
        required: false
    },
    decaf: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})


// Create mongoose model -------------------------------------------------------
const specialModel = mongoose.model('Special', specialSchema, "specials")

// Export the User model as a module.
module.exports = specialModel


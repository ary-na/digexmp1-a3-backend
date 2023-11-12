// @file    ./models/Drink.js

// Setup dependencies to create the user model.
const mongoose = require('mongoose')
const Order = require("./Order");
const Schema = mongoose.Schema

// Create schema ---------------------------------------------------------------
const drinkSchema = new mongoose.Schema({
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
        required: false,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brewMethod: {
        type: String,
        required: true
    },
    decaf: {
        type: Boolean,
        default: false
    },
    special: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})


// Create middleware ------------------------------------------------------------------
// Delete orders associated with this drink id.
drinkSchema.pre("findOneAndDelete", async function (next) {

    // Delete the drinks in an order associated with this drink id.
    await Order.deleteMany({'drinks._id': this.getQuery()._id})

    // Continue and save the data into the database.
    next()
})

// Create mongoose model -------------------------------------------------------
const drinkModel = mongoose.model('Drink', drinkSchema, "drinks")

// Export the User model as a module.
module.exports = drinkModel


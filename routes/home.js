// @file    ./routes/home.js

// Setup dependencies for user routes.
const express = require('express')
const router = express.Router()
const User = require("../models/User")
const Utils = require("../Utils")
const Drink = require("../models/Drink")


router.get('/', async (req, res) => {

    res.send("coffee on backend api homepage")

    // Seed data.
    try {
        let userCount = await User.countDocuments();
        let drinkCount = await Drink.countDocuments();
        if (!userCount && !drinkCount) {
            // Seed user data.
            console.log("seeding user data...")
            let userDocuments = await User.insertMany(Utils.getUserSeedData())
            console.log("user data seeded!")

            // Seed drink data.
            console.log("seeding drink data...")
            await Drink.insertMany(Utils.getDrinkSeedData())

            // Seed Sophia's drink data.
            let sophiaUserDocument = userDocuments.filter(document => document.email === "sanderson@coffeeon.com")[0]
            await Drink.insertMany(Utils.getSophiaDrinkSeedData(sophiaUserDocument._id))

            // Seed Ethan's drink data.
            let ethanUserDocument = userDocuments.filter(document => document.email === "elee@coffeeon.com")[0]
            await Drink.insertMany(Utils.getEthanDrinkSeedData(ethanUserDocument._id))

            // Seed Olivia's drink data.
            let oliviaUserDocument = userDocuments.filter(document => document.email === "odavis@coffeeon.com")[0]
            await Drink.insertMany(Utils.getOliviaDrinkSeedData(oliviaUserDocument._id))

            console.log("drink data seeded!")
        }
    } catch (err) {
        console.log(err)
    }
})

// Export the router object as a module.
module.exports = router
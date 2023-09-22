// @file    ./models/User.js

// Setup dependencies to create the user model.
require("mongoose-type-email");
const mongoose = require("mongoose");
const Utils = require("./../Utils");

// Create schema ---------------------------------------------------------------
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    accessLevel: {
        type: Number,
        required: true
    }
}, {timestamps: true});

// Create middleware ------------------------------------------------------------------
// Hash the user password before saving it to the database.
userSchema.pre("save", function (next) {
    // Check if the password is provided and is modified.
    if (this.password && this.isModified()) {
        // Replace the original password with the hashed password.
        this.password = Utils.hashPassword(this.password);
    }
    // Continue and save the data into the database.
    next();
});

// Create mongoose model -------------------------------------------------------
const userModel = mongoose.model("User", userSchema, "users");

// Export the User model as a module.
module.exports = userModel;
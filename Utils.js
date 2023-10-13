// Setup dependencies for the Utils class.
require("dotenv").config();
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require('uuid');
const path = require('path');

class Utils {
    /**
     * Encrypts a password using the crypto package.
     * @param password provided by the user.
     * @returns {string} a hashed password.
     */
    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString("hex")
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex")
        return [salt, hash].join("$")
    }

    /**
     * Verifies user password by comparing it to the original password.
     * @param password provided by the user.
     * @param original password saved in the database.
     * @returns {boolean} the result of comparing hashes of both passwords.
     */
    verifyPassword(password, original) {
        // Split the salt from the original password.
        const salt = original.split("$")[0]
        const originalHash = original.split("$")[1]
        // Create a hash using the provided password with the same salt as the original password.
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex")
        return hash === originalHash
    }

    /**
     * Generates access token using jsonwebtoken package.
     * @param user object provided as the payload.
     * @returns {string} a signed access token.
     */
    generateAccessToken(user) {
        return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7d"})
    }

    /**
     * Authenticate user access token before allowing access to specific endpoints.
     * @param req sent by the user.
     * @param res sent to the user.
     * @param next function to continue if authorized to access the endpoint.
     * @returns {*} a response or access to the next function.
     */
    authenticateToken(req, res, next) {
        let authHeader = req.headers["authorization"]
        let token = authHeader && authHeader.split(" ")[1]
        // Check if token is falsy.
        if (token == null) {
            return res.status(401).json({
                message: "unauthorised!"
            })
        }

        // Verify the access token and continue to the next function.
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    message: "unauthorised!"
                })
            }
            req.user = user
            next()
        })
    }

    /**
     * Upload files to the database.
     * @param file to be uploaded by the user.
     * @param uploadPath for the file to be uploaded by the user.
     * @param callback function to set the file to the database.
     */
    async uploadFile(file, uploadPath, callback) {
        // Get the file extension.
        const fileExt = file.name.split('.').pop()
        // Create a unique file name for the file.
        const uniqueFilename = uuidv4() + '.' + fileExt
        // Set the upload path to "public > images" in the backend.
        const uploadPathFull = path.join(uploadPath, uniqueFilename)

        // Move the file to the upload path.
        await file.mv(uploadPathFull, function (err) {
            if (err) {
                console.log(err)
                return false
            }
            if (typeof callback === 'function') {
                callback(uniqueFilename)
            }
        })
    }
}

// Export the Utils class as a module.
module.exports = new Utils()
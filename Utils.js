// Setup dependencies for the Utils class.
require("dotenv").config();
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class Utils {
    /**
     * Encrypts a password using the crypto package.
     * @param password provided by the user.
     * @returns {string} a hashed password.
     */
    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex");
        return [salt, hash].join("$");
    }

    /**
     * Verifies user password by comparing it to the original password.
     * @param password provided by the user.
     * @param original password saved in the database.
     * @returns {boolean} the result of comparing hashes of both passwords.
     */
    verifyPassword(password, original) {
        // Split the salt from the original password.
        const salt = original.split("$")[0];
        const originalHash = original.split("$")[1];
        // Create a hash using the provided password with the same salt as the original password.
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, "sha512").toString("hex");
        return hash === originalHash;
    }

    /**
     * Generates access token using jsonwebtoken package.
     * @param user object provided as the payload.
     * @returns {string} a signed access token.
     */
    generateAccessToken(user) {
        return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7d"});
    }

    authenticateToken(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null){
            return res.status(401).json({
                message: "Unauthorised"
            })
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                return res.status(401).json({
                    message: "Unauthorised"
                })
            }
            req.user = user
            next()
        })
    }

    uploadFile(file, uploadPath, callback){
        // get file extension (.jpg, .png etc)
        const fileExt = file.name.split('.').pop()
        // create unique file name
        const uniqueFilename = uuidv4() + '.' + fileExt
        // set upload path (where to store image on server)
        const uploadPathFull = path.join(uploadPath, uniqueFilename)
        // console.log(uploadPathFull)
        // move image to uploadPath
        file.mv(uploadPathFull, function(err) {
            if(err){
                console.log(err)
                return false
            }
            if(typeof callback == 'function'){
                callback(uniqueFilename)
            }
        })
    }
}

// Export the Utils class as a module.
module.exports = new Utils();
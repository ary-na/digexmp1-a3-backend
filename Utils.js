// Setup dependencies for the Utils class.
require("dotenv").config()
const crypto = require('crypto')
const jwt = require("jsonwebtoken")
const {v4: uuidv4} = require('uuid')
const path = require('path')

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

    /**
     * Returns array of user seed data.
     * @returns {array} of user objects.
     */
    getUserSeedData() {
        return [
            {
                firstName: "Liam",
                lastName: "Johnson",
                email: "ljohnson@gmail.com",
                password: this.hashPassword("abc123"),
                avatar: "cf6e9e09-d625-443a-b3e1-c6f379a0b98d.jpg",
                bio: "",
                accessLevel: "1"
            },
            {
                firstName: "Ava",
                lastName: "Thomas",
                email: "athomas@icloud.com",
                password: this.hashPassword("abc123"),
                avatar: "5d74861e-69cf-4513-b038-91779bdd78e1.jpg",
                bio: "I am a part-time student studying art and working as a graphic designer. I have a passion for coffee and drawing. I'm an artist who draws portraits of people and can only do it by drinking high-quality coffee. When I'm not drawing or working, I also photograph people or nature as a side hobby.",
                accessLevel: "1"
            },
            {
                firstName: "William",
                lastName: "Brown",
                email: "wbrown@coffeeon.com",
                password: this.hashPassword("abc123"),
                avatar: "8adf8509-b563-4d6e-b444-22991b21761c.jpg",
                bio: "I am William Brown, and I have been part of the \"coffee on\" team since 2017. Coffee is my passion, and I love serving customers with their daily dose of coffee. Outside work, I am a design student and love playing football with my friends on weekends. I love my job and meeting new people every day.",
                accessLevel: "2"
            },
            {
                firstName: "Sophia",
                lastName: "Anderson",
                email: "sanderson@coffeeon.com",
                password: this.hashPassword("abc123"),
                avatar: "7f466c8e-1eda-4fdd-aecd-5e086966d6a3.jpg",
                bio: "I'm Sophia. I live nearby and have worked at the \"coffee on\" for about five years. I love interacting with new people daily and love my job because I love people. I'm an extroverted and outgoing person and have many friends. I would be at the beach with my friends if I'm off during the weekend and the weather allows. Besides the beach, I love pizza and spending time with my boyfriend, Luka.",
                accessLevel: "2"
            },
            {
                firstName: "Ethan",
                lastName: "Lee",
                email: "elee@coffeeon.com",
                password: this.hashPassword("abc123"),
                avatar: "2262c6dc-7efd-4cfc-8438-3f8bd7d1035a.jpg",
                bio: "Hi, I'm Ethan. I'm a first-year design student. I work part-time at the \"coffee on\" café. I have been part of the team for more than two years, and I'm very proud to be a part of a professional team. Outside work, I like to go to the gym and hang out with my close friends. I'm also a massive fan of Star Wars :).",
                accessLevel: "2"
            },
            {
                firstName: "Olivia",
                lastName: "Davis",
                email: "odavis@coffeeon.com",
                password: this.hashPassword("abc123"),
                avatar: "e686b724-9db1-4377-8d7d-56832b8943cd.jpg",
                bio: "My name is Olivia, and I am an outgoing girl passionate about coffee. I have recently joined the \"coffee on\" crew and am very proud to serve our customers. My whole life, I've been a barista and have worked in many coffee shops, learning and gaining experience. I always wanted to be a flight stewardess, but my love for coffee kept me on the ground. I read fictional books when I'm not making coffee, aka not working.",
                accessLevel: "2"
            }
        ]
    }

    /**
     * Returns array of drink seed data.
     * @returns {array} of drink objects.
     */
    getDrinkSeedData() {
        return [
            {
                name: "Espresso",
                description: "A single shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds.",
                price: "4",
                image: "ed7e099e-d990-4354-8535-aff56926f5d9.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Americano",
                description: "A single shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds and topped with hot water.",
                price: "4",
                image: "d332ea40-7172-4f0f-a872-af71d1e9f3b2.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Cappuccino",
                description: "Made with equal parts, a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, steamed milk, and foam served in a 180-millimetre cup.",
                price: "5",
                image: "9e269390-9a1e-4fb1-9739-634672b1059e.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Latte",
                description: "Made with a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, steamed milk, topped with a thin layer of foam served in a tall 360-millimetre glass.",
                price: "5",
                image: "4f234a2e-8ccd-4378-a2ea-b285318dd679.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Mocha",
                description: "Made with a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, chocolate powder and steamed milk, topped with a thin layer of foam served in a 180-millimetre cup.",
                price: "6",
                image: "d9bff929-8357-4d99-8188-1bda450f0a1c.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Iced Coffee",
                description: "Made with a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, topped with cold water and ice, and served in a tall 360-millimetre glass.",
                price: "6",
                image: "df74a343-2488-44c8-8848-f89a07ff80a2.jpg",
                type: "Ice",
                brewMethod: "Espresso_machine_(pressure)"
            },
            {
                name: "Cold Brew",
                description: "Made with steeping premium home-roasted \"coffee on\" ground coffee in cold water for 24 hours, topped with cold water, and served in a tall 360-millimetre glass.",
                price: "5",
                image: "5f8bee74-9230-43bc-99a0-eec6b156a9c2.jpg",
                type: "Ice",
                brewMethod: "Cold_brew_(steep)"
            },
        ]
    }

    /**
     * Returns array of Sophia's drink seed data.
     * @returns {array} of drink objects.
     */
    getSophiaDrinkSeedData(userId) {
        return [
            {
                name: "Affogato",
                description: "Made with a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, poured over vanilla gelato, and served in a tall 360-millimetre glass.",
                price: "9",
                user: userId,
                image: "beb4aee8-6895-4b9d-8199-c8c0e3df007c.jpg",
                type: "Ice",
                brewMethod: "Espresso_machine_(pressure)",
                special: true
            },
            {
                name: "Macchiato",
                description: "Made with a single or double shot of premium decaf \"coffee on\" coffee grounds extracted in approximately 25-30 seconds, a small amount of steamed milk, and a lot of milk foam, served in a small 120-millimetre cup.",
                price: "7",
                user: userId,
                image: "d357c0fc-92ed-4b0b-9a88-9ea3078cdb6f.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)",
                decaf: true,
                special: true
            },
        ]
    }

    /**
     * Returns array of Ethan's drink seed data.
     * @returns {array} of drink objects.
     */
    getEthanDrinkSeedData(userId) {
        return [
            {
                name: "Vienna",
                description: "Made with a single or double shot of premium decaf \"coffee on\" coffee grounds extracted in approximately 25-30 seconds, topped with whipped cream, and served in a tall 360-millimetre glass.",
                price: "6",
                user: userId,
                image: "6d39b5d5-7e6d-4f8c-88d0-272ec4e46bea.jpg",
                type: "Hot",
                brewMethod: "Espresso_machine_(pressure)",
                decaf: true,
                special: true
            },
        ]
    }

    /**
     * Returns array of Olivia's drink seed data.
     * @returns {array} of drink objects.
     */
    getOliviaDrinkSeedData(userId) {
        return [
            {
                name: "Iced Latte",
                description: "Made with a single or double shot of premium home-roasted \"coffee on\" coffee beans extracted in approximately 25-30 seconds, cold milk, topped with ice, and served in a tall 360-millimetre glass.",
                price: "6",
                user: userId,
                image: "dd005dbd-54f2-42ca-9331-a9d88fd6a92a.jpg",
                type: "Ice",
                brewMethod: "Espresso_machine_(pressure)",
                special: true
            },
            {
                name: "Iced Aeropress",
                description: "Made with a single or double shot of premium home-roasted decaf \"coffee on\" ground coffee extracted using Aeropress, topped with cold water and ice, and served in a tall 360-millimetre glass.",
                price: "9",
                user: userId,
                image: "1ccc3741-88cc-435d-81f4-5a67682c4a1d.jpg",
                type: "Ice",
                brewMethod: "Aeropress_(pressure)",
                decaf: true,
                special: true
            },
        ]
    }
}

// Export the Utils class as a module.
module.exports = new Utils()

const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Haircut = require('./../models/MenuItem')

// GET- get all haircuts ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
    Haircut.find().populate('user', '_id firstName lastName')
        .then(haircuts => {
            if(haircuts == null){
                return res.status(404).json({
                    message: "No haircuts found"
                })
            }
            res.json(haircuts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Problem getting haircuts"
            })
        })
})

// export
module.exports = router



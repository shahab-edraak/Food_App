const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();
const secKey = process.env.SECRET_KEY

router.post("/signup",
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'minimum 5 characters allowed').isLength({ min: 5 })
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt)
        try {
            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true })
        } catch (error) {
            console.log(error);
            res.json({ success: false })
        }
    })
router.post("/login",
    body('email').isEmail(),
    body('password', 'minimum 5 characters allowed').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email
        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "Data did'nt match the Database" })
            }
            const pswCompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pswCompare) {
                return res.status(400).json({ errors: "Data did'nt match the Database" })
            }
            const data = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(data, secKey)
            return res.json({ success: true, authToken: authToken })

        } catch (error) {
            console.log(error);
            res.json({ success: false })
        }
    })

module.exports = router
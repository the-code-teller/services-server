const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Provider = require('../models/provider')


router.get('/getproviderbyservice', async (req, res) => {
    try {
        const providers = await Provider.find({service: "Backend Developer"})
    } catch (err) {
        res.send(err)
    }
})
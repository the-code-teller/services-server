const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Provider = require('../models/provider')
const authenticate = require('../middleware/authenticate')

// About Us  
router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser)
})

// Get User Data for Contact Us and Homepage  
router.get('/getdata', authenticate, (req, res) => {
    res.send(req.rootUser)
})

// Contact Us Page
router.post('/contact', authenticate, async (req, res) => {
    try {
        const {name, email, message} = req.body

        if(!name || !email || !message){
            return res.json({error: "Please fill all fielde"})
            console.log("All fields not filles");
        }

        const userContact = await User.findOne({ _id: req.userID })

        if (userContact) {
            const sellerMessage = await userContact.addMessage(name, email, message)

            await userContact.save()

            res.status(201).json({ message: "Message sent Successfully"})
        }

    } catch (error) {
        console.log(error);
    }
})

// Get Provider Details [Parameter: Service]
router.get('/gpbs', async (req, res) => {
    try {
        const providers = await Provider.find({service: "Full Stack Developer"}).select({name:1, _id:0})
        res.json(providers)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router

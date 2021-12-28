const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Provider = require('../models/provider')
const authenticate = require('../middleware/authenticate')

// Get all Data from the collection "user"
router.get('/', async(req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }
    catch(err){
        res.send('Error', err)
    }
})

// Get all Data from the collection "provider"
router.get('/provider', async(req, res) => {
    try{
        const users = await Provider.find()
        res.json(users)
    }
    catch(err){
        res.send('Error', err)
    }
})


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


// Profile Page
router.get('/profile', async (req, res) => {
    const user = await User.findById().select({name:1, email:1})
    res.send(user)
})


module.exports = router

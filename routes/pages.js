const express = require('express')
const router = express.Router()
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

module.exports = router

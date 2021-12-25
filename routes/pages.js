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

// Get List of Services Available
router.get('/los', async (req, res) => {
    try {
        const services = await Provider.find().select({service:1, _id:0})
        // Function to extract service values from the list
        const getList = (item, index, arr) => {
            arr[index] = item['service']
        }
        services.forEach(getList)
        // Remove duplicate values from the list and send
        res.send([...new Set(services)])
    } catch (err) {
        res.send(err)
    }
})

// GetProviderByService [Parameter: Service] [Returns: Provider Details]
router.get('/gpbs/:service', async (req, res) => {
    try {
        service = req.params.service.split('-')
        const toTitle = (item, index, arr) => {
            arr[index] = item[0].toUpperCase() + item.slice(1)
        }
        service.forEach(toTitle);
        service = service.join(' ')
        const providers = await Provider.find({service}).select({name:1, _id:0})
        res.json(providers)
    } catch (err) {
        res.send(err)
    }
})


// Update User Profile
router.post('/update-profile', async (req, res) => {
    try {

        const _id = req.body._id
        const user = await User.findById(_id).select({name:1, _id:0})
        if(user) {

            const name = req.body.name || user.name
            const service = req.body.service || user.service
            
            const update = await User.findByIdAndUpdate(_id, {
                name, service
            })
            
            res.send(update)
        } else {
            res.send("User not found")
        }

    } catch (err) {
        res.send(err)
    }
})


// Update Provider Profile
router.post('/provider/update-profile', async (req, res) => {
    try {

        const _id = req.body._id
        const user = await Provider.findById(_id).select({name:1, service:1, _id:0})
        if(user) {

            const name = req.body.name || user.name
            const service = req.body.service || user.service
            
            const update = await Provider.findByIdAndUpdate(_id, {
                name, service
            })
            
            res.send(update)
        } else {
            res.send("User not found")
        }

    } catch (err) {
        res.send(err)
    }
})


module.exports = router

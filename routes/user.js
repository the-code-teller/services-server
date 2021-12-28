const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Provider = require('../models/provider')


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


// Providers By Service [Parameter: Service] [Returns: Provider Details]
router.get('/pbs/:service', async (req, res) => {
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


// Get All Service Providers with details
router.get('/asp', async (req, res) => {
    try {
        const providers = await Provider.find().select({name:1, service:1, _id:0})
        res.json(providers)
    } catch (err) {
        res.send(err)
    }
})

// Get all details of a particular service provider
router.get('/adofsp/:id', async (req, res) => {
    try {
        _id = req.params.id
        const providers = await Provider.findById({_id}).select({tokens:0, _v:0})
        console.log(providers);
        res.status(200).json(providers)
    } catch (err) {
        res.status(500).send(err)
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
            }, {new: true})


            res.send(update.name)
        } else {
            res.send("User not found")
        }

    } catch (err) {
        res.send(err)
    }
})


module.exports = router

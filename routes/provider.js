const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Provider = require('../models/provider')


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

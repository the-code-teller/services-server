const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const authenticate = require('../middleware/authenticate')

// Get all Data from the collection Sellers
router.get('/', async(req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }
    catch(err){
        res.send('Error', err)
    }
})

// Register
router.post('/register', async(req, res) => {

    const {name, email, password, cpassword} = req.body

    if(!name || !email || !password || !cpassword){
        return res.status(422).json({error: "Please fill fields properly"})
    }

    try {
        const userExists = await User.findOne({email: email})
        
        if(userExists) {
            return res.status(422).json({error: 'Email already exists'})
        } else if(password != cpassword){
            return res.status(422).json({error: 'Passwords do not match'})
        } else{   
            const user = new User({name, email, password, cpassword})
            
            await user.save()
            
            res.status(201).json({message: "Registrartion Successfull"})
        }

    } catch(err) {
        console.log(err)
    }
})

// Login
router.post('/login', async(req, res) => {
    try{

        // Acquiring email and password from request object
        const {email, password} = req.body

        // Checking if the fields are empty
        if(!email || !password) {
            res.status(422).json("All fields are mandatory to fill")
        }

        // Checking Email
        const userLogin = await User.findOne({ email: email})

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password)
            

            if(!isMatch){
                res.status(422).json({error: "Invalid credentials"})
            } else{

                
                let authToken = await userLogin.generateAuthToken()
            
                res.cookie("jwtoken", authToken, {
                    expires: new Date(Date.now() + 2592000000),
                    httpOnly: true
                })

                res.status(201).json({message: "Logged In"})
            }

        }
        else{
            res.status(400).json({ error: "Invalid credentials"})
        }
    }
    catch(err) {
        res.send(err)
    }
})

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', {path: '/'})
    console.log("User logged out");
    res.status(200).send('User Logged out')
})

module.exports = router

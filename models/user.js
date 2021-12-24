const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs/dist/bcrypt')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        // username: {
        //     type: String,
        //     required: false
        // },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        // Instead of profession, Service can be used and attributes can be Service-type..
        profession: {
            type: String,
            required: false
        },
        // pricing: [
        //     service: {
        //         type: String,
        //         required: false
        //     },
        //     price: {
        //         type: Number,
        //         required: false
        //     }
        // ],
        phone: {
            type: Number,
            required: false
        },
        address: {
            state: {
                type: String,
                required: false
            },
            district: {
                type: String,
                required: false
            },
            pin_code: {
                type: Number,
                required: false
            },
            location: {
                type: String,
                required: false
            }
        },
        date: {
            type: Date,
            default: Date.now
        },
        messages: [
            {
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                message: {
                    type: String,
                    required: true
                }
            }
        ],
        tokens: [
            {
                token: {
                    type: String,
                    required: false
                }
            }
        ]
    }
)

const user = mongoose.model('USER', userSchema)

// Pasword encryption
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

// Generating Auth Token
userSchema.methods.generateAuthToken = async function () {
    try{
        const token = jwt.sign({ _id: this._id }, 'ROBERTDOWNYJUNIOR')
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token
    }
    catch(err) {
        console.log(err);
    }
}

// Add message to DB
userSchema.methods.addMessage = async function(name, email, message) {
    
    try {
        this.messages = this.messages.concat({name, email, message})
        await this.save()
        return this.messages
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongoose.model('user', userSchema)
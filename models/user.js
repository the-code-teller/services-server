const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs/dist/bcrypt')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email:  {
            type: String
        },
        password:  {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        tokens: [
            {
                token: String
            }
        ]
    }
)


// Pasword encryption for register
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})


// Generating Auth Token at Login
userSchema.methods.generateAuthToken = async function () {
    try{
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token
    }
    catch(err) {
        console.log(err);
    }
}

// Creating User Model: Parameters(Collection_name, Schema_name)
userModel = mongoose.model('user', userSchema)


module.exports = userModel
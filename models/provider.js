const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs/dist/bcrypt')


const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        service: String,
        tokens: [
            {
                token: String,
            }
        ]
    }
)


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


// Creating Provider Model: Parameters(Collection_name, Schema_name)
userModel = mongoose.model('provider', userSchema)


module.exports = userModel
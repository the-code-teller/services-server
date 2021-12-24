const mongoose = require('mongoose')

url = 'mongodb://localhost/services'

mongoose.connect(url, {useNewUrlParser: true}).then(() => {
    console.log("Connection to DB established");
}).catch((err) => console.log("Connection to DB failed"))

module.exports = mongoose

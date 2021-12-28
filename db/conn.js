const mongoose = require('mongoose')

url = 'mongodb://localhost/services'
// const url = process.env.DATABASE;

mongoose.connect(url).then(() => {
    console.log("Connection to DB established");
}).catch((err) => console.log("Connection to DB failed"))

module.exports = mongoose

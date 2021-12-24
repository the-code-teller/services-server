const path = require('path')
const express = require('express')
const app = express()
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Database

require(path.join(__dirname, 'db/conn'))

// Routes
app.use(require('./routes/auth'))
app.use(require('./routes/pages'))
// app.use(require('./routes/user'))
// app.use(require('./routes/provider'))

// Server
const PORT = 1000;
app.listen(PORT, () => {
    console.log(`Visit server at port ${PORT}`);
})
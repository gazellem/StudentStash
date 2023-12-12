const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')


app.use(logger)
dotenv.config();
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/listings',require('./routes/listingRoutes'))

connectDB()

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', 'error.html'))
    } else if (req.accepts('json')) {
        res.sendFile({message: 'error'})
    }

})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to the database')
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
})


const {server,app} = require('./socket/socket')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3500
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // ensure this directory exists
    },
    filename: function (req, file, cb) {
        // Use the original filename from the uploaded file, including the extension
        // Replace spaces with underscores and remove potential problematic characters
        const cleanFileName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9\._-]/g, '');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(cleanFileName); // Ensure this is capturing the file extension
        cb(null, file.fieldname + '_' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });


app.use(logger)
dotenv.config();
app.use(express.json())
app.use(cookieParser())
connectDB()
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the URL of your frontend app
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static('uploads'));

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/users', require('./routes/userRoutes'))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/listings',require('./routes/listingRoutes'))
app.use('/chat',require('./routes/chatRoutes'))
app.use('/messages',require('./routes/messageRoutes'))
app.use('/reports',require('./routes/reportRoutes'))







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
})
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

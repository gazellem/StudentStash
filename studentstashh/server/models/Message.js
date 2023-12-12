const mongoose = require('mongoose')


const chatScheme = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('Message',chatScheme)

module.exports = Message
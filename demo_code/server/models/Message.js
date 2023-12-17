const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
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

const Message = mongoose.model('Message',messageSchema)

module.exports = Message
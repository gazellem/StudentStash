const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        ref: 'Chat'
    }],
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Chat = mongoose.model('Chat',chatSchema)

module.exports = Chat

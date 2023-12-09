const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedListings: [{
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        ref: 'Listing'

    }]
})

module.exports = mongoose.model('User',userSchema)
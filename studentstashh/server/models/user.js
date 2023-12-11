const mongoose = require('mongoose')
const options = {discriminatorKey: 'type'}


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
    warnCount: {
        type: Number,
        default: 0
    },
    savedListings: [{
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        ref: 'Listing'
    }],
    ownListings: [{
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        ref: 'Listing'
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        default: '',
        ref: 'User'
    }],

},options)

const User = mongoose.model('User',userSchema)

/*
const adminSchema = Listing.discriminator('Admin',new mongoose.Schema({
    userType: {
        type: String,
        required: true
    }
},options))
*/


module.exports = User
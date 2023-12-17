const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    reported_user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const Report = mongoose.model('Report',reportSchema)

module.exports = Report
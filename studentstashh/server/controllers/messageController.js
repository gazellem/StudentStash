const User = require('../models/User')
const Message = require('../models/Message')
const asyncHandler = require('express-async-handler')
const Chat = require("../models/Chat");


// @post
const createMessage = asyncHandler(async (req, res) => {
    const {sender_username, receiver_username, content} = req.body

    const from = await User.findOne({username: sender_username}).lean().exec()
    const to = await User.findOne({username: receiver_username}).lean().exec()

    //if chat does not exist, create new chat.
    let foundChat = await Chat.findOne({$and: [{sender : from}, {receiver : to}]}).lean().exec()
    if(!foundChat)
        foundChat = await Chat.create({"receiver": to,"sender": from})



    const date = new Date().toLocaleDateString()
    const messageObject = {from, to, date, content}
    const message = await Message.create(messageObject)

    const chatMessage = await Chat.updateOne({$and: [{sender:from}, {receiver: to}]},{$addToSet: {messages : message}})

    if (message && chatMessage)
        res.status(201).json({message: `Message created and added to chat`})
    else
        res.status(400).json({message: `Failed to create message.`})

})

// @get
const getMessagesBySender = asyncHandler(async (req, res) => {
    const {sender_username} = req.body

    const sender = await User.findOne({username: sender_username}).lean().exec()


    const messages = await Message.find({from: sender}).lean().exec()

    res.json(message)

})

// @get
const getMessagesByReceiver = asyncHandler(async (req, res) => {
    const {receiver_username} = req.body

    const receiver = await User.findOne({username: receiver_username}).lean().exec()

    const messages = await Message.find({to: receiver}).lean().exec()

    res.json(messages)
})

// @get
const getMessages = asyncHandler(async(req,res) => {
    const {receiver_username, sender_username} = req.body

    const receiver = await User.findOne({username: receiver_username}).lean()
    const sender = await User.findOne({username: sender_username}).lean()

    const messages = await Message.find({$and: [{to: receiver},{from: sender}]}).populate('to').populate('from').lean()
    res.json(messages)
})

module.exports = {
    createMessage,
    getMessagesByReceiver,
    getMessagesBySender,
    getMessages
}

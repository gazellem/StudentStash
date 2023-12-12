const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const asyncHandler = require('express-async-handler')

// @get
const getAllChats = asyncHandler(async(req,res) =>{
    const chat = await Chat.find().lean()

    if(!chat)
        return res.json(400).json({message: 'No chat found'})
    res.json(chat)
})

// @get
const getChat = asyncHandler(async(req,res) => {
    const {receiver_username, sender_username} = req.body

    const receiver = await User.findOne({username: receiver_username}).lean().exec()
    const sender = await User.findOne({username: sender_username}).lean()

    const chat = await Chat.findOne({$and: [{sender}, {receiver}]})
    if(!chat)
        return res.status(400).json({message: 'Chat not found.'})

    res.json(chat)
})

// @post
const createChat = asyncHandler(async(req,res) => {
    const {receiver_username, sender_username} = req.body
    const receiver = await User.findOne({username: receiver_username}).lean().exec()
    const sender = await User.findOne({username: sender_username}).lean()

    const duplicateChat = await Chat.findOne({$and: [{sender}, {receiver}]})

    if(duplicateChat)
        return res.status(409).json({message: 'Chat already exists.'})

    const chatObj = {receiver,sender}

    const chat = await Chat.create(chatObj)
    if(chat)
        return res.status(201).json({message: 'Chat created.'})
    else
        return res.status(400).json({message: 'Failed to create the chat.'})

})


// @delete
const deleteChat = asyncHandler(async(req,res) => {
    //find chat

    //find all messages in the chat if any

    //delete messages if any

    //delete chat
})

module.exports = {
    getAllChats,
    getChat,
    createChat,
    deleteChat
}

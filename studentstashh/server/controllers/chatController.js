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

    const receiver = await User.findOne({username: receiver_username}).lean()
    const sender = await User.findOne({username: sender_username}).lean()

    const chat = await Chat.findOne({$and: [{sender: sender}, {receiver: receiver}]}).populate('messages').populate('receiver').populate('sender').lean()
    if(!chat)
        return res.status(400).json({message: 'Chat not found.'})

    res.json(chat)
})

// @post,
const createChat = asyncHandler(async(req,res) => {
    const {receiver_username, sender_username} = req.body
    const receiver = await User.findOne({username: receiver_username}).lean().exec()
    const sender = await User.findOne({username: sender_username}).lean().exec()

    const duplicateChat = await Chat.findOne({$and: [{sender}, {receiver}]})

    if(duplicateChat)
        return res.status(409).json({message: 'Chat already exists.'})

    const chatObj = {receiver,sender}

    const chat = await Chat.create(chatObj)

    // add the chat to users
    await User.updateMany({$or: [{username: receiver_username}, {username: sender_username}]},{$addToSet: {chats: chat}})
    if(chat)
        return res.status(201).json({message: 'Chat created.'})
    else
        return res.status(400).json({message: 'Failed to create the chat.'})

})


// @delete
const deleteChat = asyncHandler(async(req,res) => {
    const {receiver_username, sender_username} = req.body

    const receiver = await User.findOne({username: receiver_username}).lean()
    const sender = await User.findOne({username: sender_username}).lean()


    const chat = await Chat.findOne({$and: [{sender: sender}, {receiver: receiver}]}).lean()
    //find all messages in the chat if any
    //delete messages if any
    await Message.deleteMany({_id: {$in: chat.messages}})
    const rec = await User.updateOne({username: receiver_username},{$pull: {chats: chat._id}})
    const sen = await User.updateOne({username: sender_username},{$pull: {chats: chat._id}})

    //delete chat
   // await Chat.deleteOne({_id: chat._id})
    res.json({message: 'Chat deleted successfully.'})
})

module.exports = {
    getAllChats,
    getChat,
    createChat,
    deleteChat
}

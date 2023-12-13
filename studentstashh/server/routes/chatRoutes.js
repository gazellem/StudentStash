const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.route('/')
    .post(chatController.createChat)
    .get(chatController.getAllChats)

router.route('/get-chat')
    .get(chatController.getChat)

module.exports = router
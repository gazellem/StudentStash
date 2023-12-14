const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.route('/')
    .post(chatController.createChat)
    .get(chatController.getAllChats)

router.route('/get-chat')
    .get(chatController.getChat)

router.route('/delete')
    .delete(chatController.deleteChat)
module.exports = router
const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.route('/create-message')
    .post(messageController.createMessage)

router.route('/get-messages-by-receiver')
    .get(messageController.getMessagesByReceiver)

router.route('/get-messages-by-sender')
    .get(messageController.getMessagesBySender)

router.route('/get-messages')
    .get(messageController.getMessages)

module.exports = router
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

//router.use(verifyJWT)

router.route('/')
    .get(userController.getAllUsers)

router.route('/bannedUsers')
    .get(userController.getBannedUsers)

router.route('/get')
    .get(userController.getUserByUsername)

router.route('/chat/:id')
    .get(userController.getChat)
router.route('/get/:username')
    .get(userController.getUser)

router.route('/:userId')
    .get(userController.getById)

router.route('/register')
    .post(userController.createUser)

router.route('/change-password')
    .post(userController.setPassword)

router.route('/unsave-listing')
    .post(userController.unsaveListing)

router.route('/save-listing')
    .post(userController.saveListing)

router.route('/delete')
    .delete(userController.deleteUser)

router.route('/block')
    .post(userController.blockUser)

router.route('/get-id')
    .get(userController.getUserId)

router.route('/get-blocked-users/:username')
    .get(userController.getBlockedUsers)

router.route('/unblock')
    .post(userController.unblockUser)

router.route('/warn')
    .patch(userController.warnUser)

router.route('/ban')
    .patch(userController.banUser)

router.route('/unban')
    .patch(userController.unbanUser)

router.route('/admins')
    .get(userController.getAllAdmins)

router.route('/admins/create')
    .post(userController.createAdmin)

module.exports = router
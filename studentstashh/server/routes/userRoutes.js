const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.route('/')
    .get(userController.getAllUsers)

router.route('/update')
    .patch(userController.updateUser)

router.route('/block')
    .post(userController.blockUser)
router.route('/get-by-username')
    .get(userController.getUserByUsername)

router.route('/register')
    .post(userController.createUser)

router.route('/delete')
    .delete(userController.deleteUser)

router.route('/change-password')
    .post(userController.setPassword)

router.route('/save-listing')
    .patch(userController.saveListing)

router.route('/unsave-listing')
    .patch(userController.unsaveListing)

router.route('/get-blocked-users')
    .get(userController.getBlockedUsers)

router.route('/unblock')
    .post(userController.unblockUser)

module.exports = router
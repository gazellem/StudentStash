const express = require('express')
const router = express.Router()
const reportController = require('../controllers/reportController')
router.route('/')
    .get(reportController.getAllReports)

router.route('/:reportId')
    .get(reportController.getReport)


router.route('/create')
    .post(reportController.createReport)

router.route('/delete/:reportId')
    .delete(reportController.deleteReport)

module.exports = router
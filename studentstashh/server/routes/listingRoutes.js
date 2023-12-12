const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')


/*
router.route('/')
    .get(listingController.getAllListings)
    .post(listingController.createListing)
    .patch(listingController.updateListing)
    .delete(listingController.deleteListing)
*/

module.exports = router
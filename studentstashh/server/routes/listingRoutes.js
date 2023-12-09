const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(listingController.getAllListings)
    .post(listingController.createListing)
    .patch(listingController.updateListing)
    .delete(listingController.deleteListing)

module.exports = router
const express = require('express')
const router = express.Router()
const listingController = require('../controllers/listingController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.route('/')
    .get(listingController.getAllListings)
    .post(upload.array('photos'),listingController.createListing)
    .delete(listingController.deleteListing)

router.route('/update/:listingId')
    .post(listingController.updateListing)

router.route('/get/:id')
    .get(listingController.getListing)
router.route('/search/:query')
    .get(listingController.getListingByQuery)
router.route('/filter/:filter')
    .get(listingController.getListingsByFilter)
module.exports = router
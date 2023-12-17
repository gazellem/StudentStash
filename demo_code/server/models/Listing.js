const mongoose = require('mongoose')
var util = require('util')
const options = {discriminatorKey: 'type'}

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    photos: [{
        type: String, // Each string in the array is a path to a photo
        required: false
    }]
}, options);

const Listing = mongoose.model('Listing', listingSchema)

const borrowingListingSchema = Listing.discriminator('BorrowingListing', new mongoose.Schema({
    endDate: {
        type: String,
        required: true
    }
}, options))

const mateListingSchema = Listing.discriminator('MateListing', new mongoose.Schema({
    flatType: {
        type: String,
        required: true
    },
    rentPrice: {
        type: String,
        required: true
    }
}, options))

const secondHandListingSchema = Listing.discriminator('SecondHandListing', new mongoose.Schema({
    price: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
}, options))

const activityBuddyListingSchema = Listing.discriminator('ActivityBuddyListing', new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    activityCapacity: {
        type: String,
        required: true
    }
}, options))

const donationListingSchema = Listing.discriminator('DonationListing', new mongoose.Schema({
    condition: {
        type: String,
        required: true
    }
}, options))

const lostAndFoundListingSchema = Listing.discriminator('LostAndFoundListing', new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    }
}, options))

module.exports = {
    Listing,
    BorrowingListing: mongoose.model('BorrowingListing'),
    MateListing: mongoose.model('MateListing'),
    DonationListing: mongoose.model('DonationListing'),
    SecondHandListing: mongoose.model('SecondHandListing'),
    ActivityBuddyListing: mongoose.model('ActivityBuddyListing'),
    LostAndFoundListing: mongoose.model('LostAndFoundListing')
}

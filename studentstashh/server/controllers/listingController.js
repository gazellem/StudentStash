const Listing = require('../models/listing')
const asyncHandler = require('express-async-handler')

const getAllListings = asyncHandler(async(req,res) => {
    const listings = await Listing.find().lean()
    if(!listings){
        return res.status(400).json({message: 'No listings found'})
    }
    res.json(listings)
})
const createListing = asyncHandler(async (req,res) => {

})

const updateListing = asyncHandler(async (req,res) => {
})

const deleteListing = asyncHandler(async (req,res) => {

})

module.exports = {
    getAllListings,
    createListing,
    updateListing,
    deleteListing
}
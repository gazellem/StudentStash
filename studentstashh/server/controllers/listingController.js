const {Listing} = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const {BorrowingListing} = require("../models/Listing");
const User = require('../models/User')

const getAllListings = asyncHandler(async(req,res) => {
    const listings = await Listing.find().lean()
    if(!listings){
        return res.status(400).json({message: 'No listings found'})
    }
    res.json(listings)
})
const createListing = asyncHandler(async (req,res) => {
    const {type,title,description,owner_username} = req.body
    const owner = await User.findOne({username: owner_username})

   if(type === 'BorrowingListing'){
        const {endDate} = req.body
        const borrowingListingObj = {title,"description": description,owner,endDate,type}
        const listing = await Listing.create(borrowingListingObj)

        if(!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else
        {
            await User.updateOne({owner_username},{$addToSet: {ownListings: listing}})
            return res.status(201).json({message: "Listing sucessfully created."})
        }

    }

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
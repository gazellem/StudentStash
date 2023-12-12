const Listing = require('../models/Listing')
const asyncHandler = require('express-async-handler')

const getAllListings = asyncHandler(async(req,res) => {
    const listings = await Listing.find().lean()
    if(!listings){
        return res.status(400).json({message: 'No listings found'})
    }
    res.json(listings)
})
const createListing = asyncHandler(async (req,res) => {
    const {type,title,desc,owner_username} = req.body
    const owner = await User.findOne({username: owner_username}).lean().exec()

   /*
   if(type.equals('BorrowingListing')){
        const {endDate} = req.body
        const listingObj = {title, "description": desc,owner,endDate}
        const listing = await ?????.create(listingObj)

        if(!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else
            return res.status(201).json({message: "Listing sucessfully created."})
    }
   */
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
const {Listing} = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const {BorrowingListing} = require("../models/Listing");
const User = require('../models/User')

const getAllListings = asyncHandler(async(req,res) => {
    const listings = await Listing.find().populate('title').populate('description').populate('owner').lean()
    if(!listings){
        return res.status(400).json({message: 'No listings found'})
    }
    res.json(listings)
})
const createListing = asyncHandler(async (req,res) => {
    const {type,title,description,owner_username} = req.body
    const owner = await User.findOne({username: owner_username})

    const duplicate = await Listing.findOne({$and: [{owner},{title},{type}]}).lean().exec()
    if(duplicate)
        return res.status(409).json({message: "Duplicate listing"})

    if(type === 'BorrowingListing'){
        const {endDate} = req.body
        const borrowingListingObj = {title,"description": description,owner,endDate,type}
        const listing = await Listing.create(borrowingListingObj)
        if(!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else
        {
            await User.updateOne({username: owner_username},{$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else if(type === 'MateListing'){
        const {flatType, rentPrice} = req.body
        const mateListingObj = {title,"description": description,owner,flatType, rentPrice, type}
        const listing = await Listing.create(mateListingObj)
        if(!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else
        {
            await User.updateOne({username: owner_username},{$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else if(type === 'SecondHandListing') {
        const {price, condition} = req.body
        const secondHandListingObj = {title, "description": description, owner, price,condition, type}
        const listing = await Listing.create(secondHandListingObj)
        if (!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else {
            await User.updateOne({username: owner_username}, {$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else if(type === 'ActivityBuddyListing') {
        const {date,place,activityCapacity} = req.body
        const activityBuddyListingObj = {title, "description": description, owner,date,place,activityCapacity, type}
        const listing = await Listing.create(activityBuddyListingObj)
        if (!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else {
            await User.updateOne({username: owner_username}, {$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else if(type === 'DonationListing') {
        const {condition} = req.body
        const donationListingObj = {title, "description": description, owner,condition ,type}
        const listing = await Listing.create(donationListingObj)
        if (!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else {
            await User.updateOne({username: owner_username}, {$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else if(type === 'LostAndFoundListing') {
        const {date,place} = req.body
        const lostAndFoundListingObj = {title, "description": description, owner,date,place, type}
        const listing = await Listing.create(lostAndFoundListingObj)
        if (!listing)
            return res.status(400).json({message: "Listing could not be created."})
        else {
            await User.updateOne({username: owner_username}, {$addToSet: {ownListings: listing}}).lean().exec()
            return res.status(201).json({message: "Listing sucessfully created."})
        }
    }
    else
        return res.json({message: "no such type exists"})

})

const updateListing = asyncHandler(async (req,res) => {

})

const deleteListing = asyncHandler(async (req,res) => {
    const {owner_username,title,type} = req.body
    const owner = await User.findOne({username: owner_username}).lean()
    const listing =  await Listing.findOne({$and: [{owner},{title},{type}]}).lean().exec()

    const deleted = await User.updateOne({username: owner_username},{$pull: {ownListings: listing._id}})

    res.json({message: "Listing deleted."})
})

module.exports = {
    getAllListings,
    createListing,
    updateListing,
    deleteListing
}
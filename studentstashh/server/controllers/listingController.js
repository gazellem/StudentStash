const {Listing,LostAndFoundListing,BorrowingListing,ActivityBuddyListing
    ,DonationListing,SecondHandListing,MateListing} = require('../models/Listing')
const asyncHandler = require('express-async-handler')
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
    if(!owner)
        return res.status(400).json({message :`${owner_username} does not exist`})
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
    const {type,title,description,owner_username,new_title,new_description} = req.body
    const owner = await User.findOne({username: owner_username}).lean().exec()
    if(!owner)
        return res.status(400).json({message: `${owner_username} does not exist`})

    const foundListing = await Listing.findOne({type,title,description,owner}).lean().exec()
    if(!foundListing)
        return res.status(400).json({message: `Listing does not exist`})

    if(type === 'BorrowingListing'){
        const {endDate,new_endDate} = req.body
        const listing = await BorrowingListing.updateOne({title,"description": description,owner,type}
                    ,{title: new_title,description: new_description,endDate: new_endDate})
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data"})
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'MateListing'){
        const {flatType, rentPrice,new_flatType,new_rentPrice} = req.body
        const listing = await MateListing.updateOne({title,description,owner},
            {title: new_title,description: new_description,flatType: new_flatType,rentPrice: new_rentPrice})
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data."})
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'SecondHandListing') {
        const {price, condition,new_price,new_condition} = req.body
        const listing = await SecondHandListing.updateOne({title,description,owner},
            {title: new_title,description: new_description,price: new_price,condition: new_condition})
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data."})
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'ActivityBuddyListing') {
        const {date,place,activityCapacity,new_date,new_place,new_activityCapacity} = req.body
        const listing = await ActivityBuddyListing.updateOne({title,description,owner},
            {title: new_title,description: new_description,date: new_date,place: new_place,activityCapacity: new_activityCapacity})
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data."})
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'DonationListing') {
        const {condition,new_condition} = req.body
        const listing = await DonationListing.updateOne({title,description,owner},
            {title: new_title,description: new_description,condition: new_condition})
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data."})
        return res.json({message: 'Listing updated.'})

    }
    else if(type === 'LostAndFoundListing') {
        const {date,place,new_date,new_place} = req.body
        const listing = await LostAndFoundListing.updateOne({title,description,owner},
            {title: new_title,description: new_description,date: new_date,place: new_place}).lean().exec()
        if(!listing)
            return res.status(400).json({message: "Enter valid listing data."})
        return res.json({message: 'Listing updated.'})
    }
    else
        return res.json({message: "no such type exists"})
})

const deleteListing = asyncHandler(async (req,res) => {
    const {owner_username,title,type} = req.body
    const owner = await User.findOne({username: owner_username}).lean()
    if(!owner)
        return res.status(400).json({message: `${owner_username} does not exist.`})
    const listing =  await Listing.deleteOne({$and: [{owner},{title},{type}]}).lean()
    if(!listing)
        return res.json(400).json({message: 'Listing does not exist'})
    const deleted = await User.updateOne({username: owner_username},{$pull: {ownListings: listing._id}})

    res.json({message: "Listing deleted."})
})

module.exports = {
    getAllListings,
    createListing,
    updateListing,
    deleteListing
}
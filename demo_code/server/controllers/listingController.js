const {Listing,LostAndFoundListing,BorrowingListing,ActivityBuddyListing
    ,DonationListing,SecondHandListing,MateListing} = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const path = require("path");

const getAllListings = asyncHandler(async(req,res) => {
    const listings = await Listing.find().populate('title').populate('description').populate('owner').lean()
    if(!listings){
        return res.status(400).json({message: 'No listings found'})
    }
    listings.reverse()
    res.json(listings)
})
const createListing = asyncHandler(async (req, res) => {
    const { type, title, description, owner_username } = req.body;
    const photoPaths = req.files.map(file => `/uploads/${file.filename}`);
    const owner = await User.findOne({ username: owner_username }).lean();
    if (!owner) {
        console.log(`User not found for username: ${owner_username}`);
        return res.status(400).json({ message: `User ${owner_username} does not exist` });
    }

    let listingObj = { owner,title,type,description, photos: photoPaths }; // Common properties

    if (type === 'BorrowingListing') {
        const { endDate } = req.body;
        listingObj = { ...listingObj, endDate };
    } else if (type === 'MateListing') {
        const { flatType, rentPrice } = req.body;
        listingObj = { ...listingObj, flatType, rentPrice };
    } else if (type === 'SecondHandListing') {
        const { price, condition } = req.body;
        listingObj = { ...listingObj, price, condition };
    } else if (type === 'ActivityBuddyListing') {
        const { date, place, activityCapacity } = req.body;
        listingObj = { ...listingObj, date, place, activityCapacity };
    } else if (type === 'DonationListing') {
        const { condition } = req.body;
        listingObj = { ...listingObj, condition };
    } else if (type === 'LostAndFoundListing') {
        const { date, place } = req.body;
        listingObj = { ...listingObj, date, place };
    } else {
        return res.status(400).json({ message: "Invalid listing type" });
    }

    const listing = await Listing.create(listingObj);
    if (!listing) {
        return res.status(400).json({ message: "Listing could not be created." });
    }

    await User.updateOne({ username: owner_username }, { $addToSet: { ownListings: listing } }).lean().exec();
    return res.status(201).json({ message: "Listing successfully created." });
});

const updateListing = asyncHandler(async (req,res) => {
    const {type,title,description} = req.body
    const {listingId} = req.params

    console.log(req.body)
    const foundListing = await Listing.findById(listingId).lean()
    if(!foundListing)
        return res.status(400).json({message: `Listing does not exist`})

    if(type === 'BorrowingListing'){
        const {endDate} = req.body
        if(title)
            await BorrowingListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await BorrowingListing.updateOne({_id:listingId},{description}).lean().exec()
        if(endDate)
            await BorrowingListing.updateOne({_id:listingId},{description}).lean().exec()
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'MateListing'){
        const {flatType, rentPrice} = req.body
        if(title)
            await MateListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await MateListing.updateOne({_id:listingId},{description}).lean().exec()
        if(flatType)
            await MateListing.updateOne({_id:listingId},{flatType}).lean().exec()
        if(rentPrice)
            await MateListing.updateOne({_id:listingId},{rentPrice}).lean().exec()
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'SecondHandListing') {
        const {price, condition} = req.body
        if(title)
            await SecondHandListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await SecondHandListing.updateOne({_id:listingId},{description}).lean().exec()
        if(price)
            await SecondHandListing.updateOne({_id:listingId},{price}).lean().exec()
        if(condition)
            await SecondHandListing.updateOne({_id:listingId},{condition}).lean().exec()
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'ActivityBuddyListing') {
        const {date,place,activityCapacity} = req.body
        if(title)
            await ActivityBuddyListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await ActivityBuddyListing.updateOne({_id:listingId},{description}).lean().exec()
        if(date)
            await ActivityBuddyListing.updateOne({_id:listingId},{date}).lean().exec()
        if(place)
            await ActivityBuddyListing.updateOne({_id:listingId},{place}).lean().exec()
        if(activityCapacity)
            await ActivityBuddyListing.updateOne({_id:listingId},{activityCapacity}).lean().exec()
        return res.json({message: 'Listing updated.'})
    }
    else if(type === 'DonationListing') {
        const {condition} = req.body
        if(title)
            await DonationListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await DonationListing.updateOne({_id:listingId},{description}).lean().exec()
        if(condition)
            await DonationListing.updateOne({_id:listingId},{condition}).lean().exec()
        return res.json({message: 'Listing updated.'})

    }
    else if(type === 'LostAndFoundListing') {
        const {date,place} = req.body
        if(title)
            await LostAndFoundListing.updateOne({_id:listingId},{title}).lean().exec()
        if(description)
            await LostAndFoundListing.updateOne({_id:listingId},{description}).lean().exec()
        if(date)
            await LostAndFoundListing.updateOne({_id:listingId},{date}).lean().exec()
        if(place)
            await LostAndFoundListing.updateOne({_id:listingId},{place}).lean().exec()
        return res.json({message: 'Listing updated.'})
    }
    else
        return res.json({message: "no such type exists"})
})

const deleteListing = asyncHandler(async (req,res) => {
    const {listingId,owner_username} = req.body
    const owner = await User.findOne({username: owner_username}).lean()
    if(!owner)
        return res.status(400).json({message: `${owner_username} does not exist.`})
    const listing =  await Listing.deleteOne({_id: listingId}).lean()
    if(!listing)
        return res.json(400).json({message: 'Listing does not exist'})
    const pullOwn = await User.updateOne({username: owner_username},{$pull: {ownListings: listingId}})
    const pullSaves = await User.updateMany({$in: {savedListings: listingId}},{$pull:{ownListings: listingId}})

    res.json({message: "Listing deleted."})
})

const getListing = asyncHandler(async(req,res) => {
    const {id} = req.params
    const listing = await Listing.findById(id).populate('owner').lean()
    res.json(listing)

})

const getListingByQuery = asyncHandler(async (req, res) => {
    const { query } = req.params;
    const listings = await Listing.find({ title: { $regex: query, $options: 'i' } });
    res.json(listings);
});

const getListingsByFilter = asyncHandler(async(req, res) => {
    const {filter} = req.params;
    console.log(filter)
    console.log("wqaefsd")

    const listings = await Listing.find({ type: filter });
    res.json(listings);
});
module.exports = {
    getAllListings,
    createListing,
    updateListing,
    deleteListing,
    getListing,
    getListingByQuery,
    getListingsByFilter
}

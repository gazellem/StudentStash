const User = require('../models/User')
const Listing = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().lean()
    if (!users) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

const getUserByUsername = asyncHandler(async (req, res) => {
    const {username} = req.body
    const foundUser = await User.findOne({username}).select('-password').lean()
    if (!foundUser)
        return res.status(400).json({message: 'No user with such username.'})

    res.json(foundUser)
})

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body
    if (!username || !password || !email) {
        return res.status(400).json({message: 'All fields are required!'})
    }
    const duplicateUsername = await User.findOne({username}).lean().exec()
    const duplicateEmail = await User.findOne({email}).lean().exec()
    if (duplicateUsername) {
        return res.status(409).json({message: 'Duplicate username'})
    }
    if (duplicateEmail) {
        return res.status(409).json({message: 'Duplicate email'})
    }

    //Hash the password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds

    const userObject = {username, email, "password": hashedPwd}

    //create and store new user
    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({message: `New user ${username} created. `})
    } else {
        res.status(400).json({message: 'Invalid userdata received'})
    }

})

const updateUser = asyncHandler(async (req, res) => {
    const {id, username, email, password} = req.body

    //confirm data
    if (!id || !username || !password || !email) {
        return res.status(400).json({message: 'All fields are required!'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    //check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.email = email
    if (password) {
        const hashedPwd = await bcrypt.hash(password, 10)
        await User.findOneAndUpdate({username},{password: hashedPwd})
    }
    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
})

const setPassword = asyncHandler(async (req, res) => {
    const {username, old_password, new_password} = req.body
    const foundUser = await User.findOne({username}).lean().exec()
    const match = bcrypt.compare(old_password, foundUser.password)
    if (old_password === foundUser.password)
    {
        await User.findOneAndUpdate({username},{password: new_password})
        return res.json({message: `Password updated.`})
    }
    else
        return res.status(409).json({message: "wrong password"})
})

const unsaveListing = asyncHandler(async (req, res) => {
    const {username, listing_id} = req.body

    const foundListing = await Listing.findOne({_id: listing_id}).lean().exec()

    if (!foundListing)
        User.updateOne({username}, {$pull: {savedListings: foundListing}})

    res.json({message: 'Listing saved.'})
})

const saveListing = asyncHandler(async (req, res) => {
    const {username, listing_id} = req.body

    const foundListing = await Listing.findOne({_id: listing_id}).lean().exec()
    const saved = await User.updateOne({username}, {$addToSet: {savedListings: foundListing}}).lean().exec()
    res.json({message: 'Listing saved.'})
})

const deleteUser = asyncHandler(async (req, res) => {
    const {username} = req.body

    const user = await User.findOne({username}).lean().exec()
    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const result = await User.deleteOne({username}).lean()

    const reply = `${result.username} deleted`
    res.json(reply)
})

const blockUser = asyncHandler(async(req,res) => {

})
module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser,
    updateUser,
    blockUser,
    deleteUser,
    setPassword,
    saveListing,
    unsaveListing
}
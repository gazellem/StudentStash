const User = require('../models/User')
const {Listing} = require('../models/Listing')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const {hash} = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({type: 'User'}).lean()
    if (!users) {
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
})

const getUserByUsername = asyncHandler(async (req, res) => {
    const {username} = req.body
    const foundUser = await User.findOne({username}).select('-password').populate('ownListings').populate('savedListings').lean()
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

const setPassword = asyncHandler(async (req, res) => {
    const {username, old_password, new_password} = req.body
    const foundUser = await User.findOne({username}).lean()
    if(!foundUser)
        return res.status(400).json({message: `${username} does not exist`})
    const match = await bcrypt.compare(old_password, foundUser.password)
    if (match)
    {
        const hashedPwd = await bcrypt.hash(new_password,10)
        await User.findOneAndUpdate({username},{password: hashedPwd})
        return res.json({message: `Password updated.`})
    }
    else
        return res.status(409).json({message: "wrong password"})
})

const unsaveListing = asyncHandler(async (req, res) => {
    const {username, title,owner_username,type} = req.body
    const owner = await User.findOne({username: owner_username}).lean()
    const foundListing = await Listing.findOne({$and: [{title},{owner},{type}]}).lean().exec()
    if(!foundListing)
        return res.status(400).json({message: 'Listing does not exist.'})
    const user = await User.findOneAndUpdate({username},{$pull: {savedListings: foundListing._id}}).lean()
    if(!user)
        return res.status(400).json({message: 'User does not exist'})
    res.json({message: 'Listing unsaved.'})
})

const saveListing = asyncHandler(async (req, res) => {
    const {username, title,owner_username,type} = req.body

    const owner = await User.findOne({username: owner_username}).lean()
    const foundListing = await Listing.findOne({$and: [{title},{owner},{type}]}).lean().exec()
    if(!foundListing)
        return res.status(400).json({message: 'Listing does not exist.'})
    const user = await User.findOneAndUpdate({username},{$addToSet: {savedListings: foundListing._id}}).lean()
    if(!user)
        return res.status(400).json({message: 'User does not exist'})
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
    const {blocker_username, blocked_username} = req.body

    const blocked_user = await User.findOne({username: blocked_username}).lean()
    const blocker = await User.updateOne({username: blocker_username},{$addToSet: {blockedUsers: blocked_user._id}})
    res.json({message: `${blocked_user.username} is blocked by ${blocker_username}` })

})

const getUserId = asyncHandler(async(req,res) => {
    const {username} = req.body
    const user = await User.findOne({username}).lean()
    res.json(user.username)
})

const getBlockedUsers = asyncHandler(async(req,res) => {
    const {username} = req.body

    const user = await User.findOne({username}).populate('blockedUsers').lean()
    res.json(user.blockedUsers)
})

const unblockUser = asyncHandler(async(req,res) => {
    const {username,blocked_username} = req.body
    const blocked_user = await User.findOne({username: blocked_username}).lean()
    let user = await User.findOne({username}).lean()
    const updated = await User.updateOne({username},{$pull: {blockedUsers: blocked_user._id}})
    res.json({message: `${blocked_username} unblocked` })
})

const warnUser = asyncHandler(async (req,res) => {
    const {username} = req.body
    const user = await User.updateOne({username},{$inc: {warnCount: 1}}).lean()
    if(!user)
        return res.json({message: `${username} not found.`})
    if(user.warnCount >= 3){
        const bannedUser = await User.updateOne({username},{banned: true}).lean()
        return res.json({message: `${username} warned and banned.`})
    }
    res.json({message: `${username} warned`})

})

const banUser = asyncHandler(async (req,res) => {
    const {username} = req.body
    const user = await User.updateOne({username},{banned: true}).lean()
    if(!user)
        return res.json({message: `${username} not found.`})
    res.json({message: `${username} banned.`})
})

const unbanUser = asyncHandler(async (req,res) => {
    const {username} = req.body
    const user = await User.updateOne({username},{banned: false}).lean()
    if(!user)
        return res.json({message: `${username} not found.`})
    res.json({message: `${username} unbanned.`})
})

const getAllAdmins = asyncHandler(async(req,res) => {
    const admins = await User.find({type:'Admin'}).lean()
    res.json(admins)
})

const createAdmin = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body
    const type = 'Admin'


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
    const adminObject = {username, email, "password": hashedPwd,type}
    //create and store new user
    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({message: `New admin ${username} created. `})
    } else {
        res.status(400).json({message: 'Invalid userdata received'})
    }
})
module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser,
    blockUser,
    deleteUser,
    setPassword,
    saveListing,
    unsaveListing,
    getBlockedUsers,
    unblockUser,
    getUserId,
    warnUser,
    banUser,
    createAdmin,
    getAllAdmins,
    unbanUser
}
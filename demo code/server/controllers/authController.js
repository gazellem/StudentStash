const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


// @desc login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({message: 'Enter an email and a password'})
    }

    const foundUser = await User.findOne({email}).lean()
    if (!foundUser) {
        return res.status(400).json({message: 'Email not found'})
    }
    if(foundUser.banned)
        return res.json({message: 'User is banned'})

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match){
        return res.status(401).json({message: 'Wrong password'})
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "email": foundUser.email,
                "savedListings": foundUser.savedListings
            }
        },
        'ed9c197149e5195dc791ce2fde6fde3c40e242f692b66cbfc045ced404563c489e4b3d13ab62b2ad6a2761a8a8f8dcb8c43e370d17dad6df7433f6a37e17f077',
        {expiresIn: '5m'}
    )
    const refreshToken = jwt.sign(
        {"email": foundUser.email},
        '0871849030a7e9dc879c121e1f27de68e2414b02361aa5db7996ee5a1a1e49c5558a292f8a390289e85f4f2937fd1b3576cedb5fca785be4932342a554ca6534',
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
        token: accessToken,
        user: foundUser
    })
})


// @desc refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.status(401).json({message: "Unauthorized"})
    }
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        '0871849030a7e9dc879c121e1f27de68e2414b02361aa5db7996ee5a1a1e49c5558a292f8a390289e85f4f2937fd1b3576cedb5fca785be4932342a554ca6534',
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'})

            const foundUser = await User.findOne({email: decoded.email})
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "email": foundUser.email,
                        "savedListings": foundUser.savedListings
                    }
                },
                'ed9c197149e5195dc791ce2fde6fde3c40e242f692b66cbfc045ced404563c489e4b3d13ab62b2ad6a2761a8a8f8dcb8c43e370d17dad6df7433f6a37e17f077',
                {expiresIn: '10s'}
            )
            res.json({accessToken})
        })
    )
})


// @desc logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: 'Cookie cleared'})
})

module.exports = {
    login,
    refresh,
    logout
}
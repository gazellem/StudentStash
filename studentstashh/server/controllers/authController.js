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
        return res.status(400).json({message: 'Enter a username and a password'})
    }

    const foundUser = await User.findOne({email}).lean()


    if (!foundUser) {
        return res.status(400).json({message: 'Email not found'})
    }

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
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '5m'}
    )
    const refreshToken = jwt.sign(
        {"email": foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({accessToken})
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
        process.env.REFRESH_TOKEN_SECRET,
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
                process.env.ACCESS_TOKEN_SECRET,
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
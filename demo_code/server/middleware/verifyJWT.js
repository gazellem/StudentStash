const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) => {
            if(err) return res.status(403).json({message: 'Forbidden'})
            req.username = decoded.UserInfo.username
            req.email = decoded.UserInfo.email
            req.savedListings = decoded.UserInfo.savedListings
            req.ownListings = decoded.UserInfo.ownListings
            req.chats = decoded.UserInfo.chats
            next()
        }
    )

}

module.exports = verifyJWT
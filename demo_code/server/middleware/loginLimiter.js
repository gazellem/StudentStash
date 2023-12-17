const rateLimit = require('express-rate-limit')
const {logEvents} = require('./logger')

const loginLimiter = rateLimit  ({

    windowMs: 60*1000, //1 minute
    max:5, //limit each IP to 5 login requests per 'window' per minute
    message: {
        message: 'Too many login attempts from this ip. Try again after 60 seconds.'
    },
    handler: (req,res,next,options) =>{
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t
        ${req.headers.origin}`,'error.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false

})

module.exports = loginLimiter
const mongoose = require('mongoose')
const connectDB = async () => {
    try{
        mongoose.connect('mongodb+srv://user:123pass123@studentstashdb.x1ocmul.mongodb.net/')
    }
    catch(err){
        console.log(err)
    }
}
module.exports = connectDB
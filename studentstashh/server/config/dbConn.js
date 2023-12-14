const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");
const connectDB = async () => {
    try{
        mongoose.connect(process.env.DATABASE_URI)
    }
    catch(err){
        console.log(err)
    }
}
module.exports = connectDB
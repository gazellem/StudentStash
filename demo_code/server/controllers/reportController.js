const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const Report = require('../models/Report')
const asyncHandler = require('express-async-handler')

const getAllReports = asyncHandler(async(req,res) => {
    const reports = await Report.find().populate('reported_user').populate('reporter').lean()
    if(!reports)
        return res.json({message:"No reports found."})
    res.json(reports)
})

const deleteReport = asyncHandler(async (req,res) => {
    const {reportId} = req.params


    const report = await Report.deleteOne({_id: reportId}).lean()
    if(!report)
        return res.json("Report not found.")
    res.json("Report successfully deleted.")
})

const createReport = asyncHandler(async(req,res) => {
    const {reporter_username,reported_username,description} = req.body
    console.log(req.body)
    const reporter = await User.findOne({username: reporter_username}).lean()
    const reported_user = await User.findOne({username: reported_username}).lean()

    if(!reporter && !reported_user)
        return res.status(400).json({message: `${reporter_username} and ${reported_username} do no exist`})

    else if(!reported_user)
        return res.status(400).json({message: `${reported_username} could not be found`})
    else if(!reporter)
        return res.status(400).json({message: `${reporter_username} could not be found`})

    const duplicate = await Report.findOne({reporter,reported_user}).lean().exec()
    if(duplicate)
       return res.status(409).json({message: `${reported_username} is already reported.`})

    const date = new Date().toLocaleString()
    const reportObject = {reporter,reported_user,date,description}
    const report = await Report.create(reportObject)
    if(report)
        return res.status(201).json({message: `${reported_username} reported.`})
    else
        return res.status(400).json({message: 'Invalid report data received'})
})

const getReport = asyncHandler(async (req,res) => {
    const {reportId} = req.params

    const report = await Report.findOne({_id: reportId}).populate('reported_user').populate('reporter').lean()
    if(!report)
        return res.status(400).json({message: `Report not found.`})

    res.json(report)
})

module.exports = {
    getAllReports,
    deleteReport,
    createReport,
    getReport
}
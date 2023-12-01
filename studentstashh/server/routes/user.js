const express = require("express");

const userRoutes = express.Router();

const { User } = require("../models/user");

// Get all users
userRoutes.route("/user").get(async function (req, res) {
    console.log("get /user called");
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ reason: "error occurred" });
    };
});

// Get a user
userRoutes.route("/user/:id").get(async function (req, res) {
    console.log("get /user/:id called");
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ reason: "error occurred" });
    };
});

// Add a user
userRoutes.route("/user/add").post(async function (req, res) {
    console.log("post /user/add called");
    try {
        const newUser = new User ({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ reason: "error occurred" });
    };
});

// Update a user
userRoutes.route("/user/update/:id").post(async function (req, res) {
    console.log("post /user/update/:id called");
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.email = req.body.email;
        await User.updateOne({ _id: id }, user);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ reason: "error occurred" });
    };
});

// Delete a user
userRoutes.route("/user/delete/:id").delete(async function (req, res) {
    console.log("post /user/delete/:id called");
    try {
        const id = req.params.id;
        const deletedDog = await User.findByIdAndDelete(id);
        res.status(200).json();
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ reason: "error occurred" });
    };
});

module.exports = userRoutes;
const express = require("express");

const mongoose = require("mongoose");

const app = express();

const cors = require("cors");

const body_parser = require('body-parser');

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use(require("./routes/user"));

app.use(body_parser.urlencoded({ extended: true }));

// Start server
const start = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
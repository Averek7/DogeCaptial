const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require("dotenv").config();

const mintnft = require("./routes/mintnft");
const connectToMongo = require("../server/db/connection");

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongo();

app.use("/api",mintnft);

app.get('/', (req, res) => {
  res.send("Welcome to NFT Uploads");
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


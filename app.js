const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json()); //req.body가 객체로 인식됨
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

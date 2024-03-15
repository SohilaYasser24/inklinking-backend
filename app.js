const express = require("express");
const cors = require("cors");

const connectDB = require("./db");
require("dotenv").config("./.env");
const AppError = require("./utils/appError");
const globalHandler = require("./controllers/errorController");
const authRoute = require("./routes/userRoute");
const homeRoute = require("./routes/homeRoute");
const dashboardRoute = require("./routes/dashboardRoute");

const app = express();
app.use(cors());

app.use(express.static("Uploads")); // Will serve any file in "uploads" folder
app.use(express.json());

app.use("/", authRoute);
app.use("/books", homeRoute);
app.use("/admin", dashboardRoute);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});

app.use(globalHandler);

const db = process.env.URL_MONGO;
const port = process.env.PORT || 7000;
connectDB(db);
app.listen(port, () => {
  console.log("Server is running on localhost:3000");
});

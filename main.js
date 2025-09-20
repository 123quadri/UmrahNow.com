require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import configurations and utilities
const { connectDB } = require("./config/database");
const { configureSession, configurePassport } = require("./config/auth");
const { setupMiddleware } = require("./config/middleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cityRoutes = require("./routes/cityRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Database connection
connectDB();

// Configure session and passport
configureSession(app);
configurePassport();

// Setup middleware
setupMiddleware(app);

// Routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/", cityRoutes);
app.use("/", packageRoutes);
app.use("/", bookingRoutes);

// Start server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, function () {
  console.log("App is running successfully on port", port);
});

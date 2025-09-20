const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

// Initialize global variables
global.profilephoto = " ";
global.user_dp = " ";
global.reviewname = "";
global.entryEmail = "";
global.selectedPackage = "";
global.selectedCity = "";
global.xcoordinate = "";
global.ycoordinate = "";
global.pdfName = "";
global.user_status = "";
global.temperature = "";
global.description = "";
global.image_url = "";
global.randomtoken = "";

// Date setup
let today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
global.day = today.toLocaleDateString("en-US", options);

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

const multipleUpload = upload.fields([
  { name: "cityImage", maxCount: 1 },
  { name: "tourImg1", maxCount: 1 },
  { name: "tourImg2", maxCount: 1 },
  { name: "tourImg3", maxCount: 1 },
]);

const setupMiddleware = (app) => {
  app.use(express.static(__dirname.replace("config", "")));
  app.use(express.static("uploads"));
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));
};

module.exports = { setupMiddleware, upload, multipleUpload };

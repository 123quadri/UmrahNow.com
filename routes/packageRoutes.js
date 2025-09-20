const express = require("express");
const router = express.Router();
const randomstring = require("random-string-gen");
const { CityDetails, Package } = require("../models");
const { upload } = require("../config/middleware");

// Create Package page
router.get("/createPackage", function (req, res) {
  CityDetails.find({}, function (err, cityDetails) {
    res.render("create_package", {
      cityDetailsLists: cityDetails,
      success: "",
    });
  });
});

// Create Package POST
router.post("/createPackage", upload.single("packageImg"), function (req, res) {
  var pacincrement = randomstring({ length: 12, type: "alphanumeric" });

  const package = new Package({
    packageCity: req.body.selectCity,
    packageName: req.body.packageName,
    packageDays: req.body.packageDays,
    packagePrice: req.body.packagePrice,
    packageType: req.body.packageType,
    packageImg: req.file.filename,
    packageid: pacincrement,
  });

  package.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      CityDetails.find({}, function (err, cityDetails) {
        res.render("create_package", {
          cityDetailsLists: cityDetails,
          success: "Successfully Created Package",
        });
      });
    }
  });
});

// Delete Package page
router.get("/deletePackage", function (req, res) {
  Package.find({}, function (err, packageDetails) {
    res.render("deletePackage", {
      packageDetails: packageDetails,
      success: "",
    });
  });
});

// Delete Package POST
router.post("/delete-package", function (req, res) {
  Package.deleteOne({ packageid: req.body.todeletePackageID }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/popupDeletePackage");
});

// Delete Package confirmation
router.get("/popupDeletePackage", function (req, res) {
  Package.find({}, function (err, packageDetails) {
    res.render("deletePackage", {
      packageDetails: packageDetails,
      success: "Package Deleted Successfully",
    });
  });
});

// Select package for booking
router.post("/selected-package", function (req, res) {
  global.selectedPackage = req.body.SelectedPackage;
  res.redirect("/details");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { CityDetails, UserReviews, Form } = require("../models");

// Entry/Home page
router.get("/entry", function (req, res) {
  CityDetails.find({}, function (err, cityDetails) {
    UserReviews.find({}, function (error, rev) {
      res.render("index", {
        cityDetailsLists: cityDetails,
        dp: global.profilephoto,
        name: global.reviewname,
        testimonials: rev,
      });
    });
  });
});

// Contact Us page
router.get("/contactUs", function (req, res) {
  res.render("contactUs", {
    name: global.reviewname,
  });
});

// About Us page
router.get("/aboutus", function (req, res) {
  res.render("AboutUs", {
    name: global.reviewname,
  });
});

// My Bookings page
router.get("/Bookings", function (req, res) {
  Form.find({ entry_email: global.entryEmail }, function (err, founduser) {
    res.render("mybookings", {
      usersList: founduser,
      name: global.reviewname,
    });
  });
});

// Take Review (submit review)
router.post("/takeReview", function (req, res) {
  const finalreview = new UserReviews({
    review: req.body.userReview,
    dp: global.profilephoto,
    name: global.reviewname,
  });
  finalreview.save();
  res.redirect("/entry");
});

module.exports = router;

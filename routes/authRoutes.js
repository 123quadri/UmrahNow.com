const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const { CityDetails, UserReviews } = require("../models");

// Root route
router.get("/", function (req, res) {
  res.sendFile(__dirname.replace("routes", "") + "/login.html");
});

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/login",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/entry");
  }
);

// Register route
router.post("/register", function (req, res) {
  global.reviewname = req.body.name;
  global.entryEmail = req.body.username;
  console.log("Registration attempt");

  User.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log("Registration error:", err);
      } else {
        console.log("Registration successful");
        passport.authenticate("local")(req, res, function () {
          CityDetails.find({}, function (err, cityDetails) {
            UserReviews.find({}, function (error, rev) {
              res.render("index", {
                cityDetailsLists: cityDetails,
                testimonials: rev,
                name: global.reviewname,
              });
            });
          });
        });
      }
    }
  );
});

// Login route
router.post("/login", function (req, res) {
  global.entryEmail = req.body.username;
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        CityDetails.find({}, function (err, cityDetails) {
          UserReviews.find({}, function (error, rev) {
            User.findOne(
              { username: req.body.username },
              function (error, singleuser) {
                global.reviewname = singleuser.name;
                res.render("index", {
                  cityDetailsLists: cityDetails,
                  testimonials: rev,
                  name: global.reviewname,
                });
              }
            );
          });
        });
      });
    }
  });
});

// Logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;

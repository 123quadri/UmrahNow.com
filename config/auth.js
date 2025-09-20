const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const configureSession = (app) => {
  app.use(
    session({
      secret: "Dua-Al-Madinah",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

const configurePassport = () => {
  passport.use(User.createStrategy());

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        // callbackURL: "https://hidden-mesa-15600.herokuapp.com/auth/google/login",
        callbackURL: "http://localhost:4000/auth/google/login",
        userProfileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      function (accessToken, refreshToken, profile, cb) {
        // Set global variables (consider moving to a better state management solution)
        global.profilephoto = profile.photos[0].value;
        global.reviewname = profile.displayName;
        global.entryEmail = profile.id;

        User.findOrCreate(
          { googleId: profile.id, username: profile.displayName },
          function (err, user) {
            return cb(err, user);
          }
        );
      }
    )
  );
};

module.exports = { configureSession, configurePassport };

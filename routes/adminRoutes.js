const express = require("express");
const router = express.Router();
const { Form, CityDetails, BookedDetails } = require("../models");

// Admin login page
router.get("/admin", function (req, res) {
  res.render("adminLogin", { name: global.reviewname });
});

// Admin login verification
router.post("/adminlogin", function (req, res) {
  if (
    req.body.adminUsername == process.env.ADMIN_USERNAME &&
    req.body.adminPassword == process.env.ADMIN_PASSWORD
  ) {
    CityDetails.find({}, function (err, cityDetails) {
      res.render("queryRequest", {
        cityDetailsLists: cityDetails,
        booking_details: "",
      });
    });
  } else {
    console.log("unauthentication access");
  }
});

// Request management
router.get("/request", function (req, res) {
  Form.find({}, function (err, form) {
    res.render("request", {
      booking_details: form,
    });
  });
});

// Query Request page
router.get("/queryRequest", function (req, res) {
  CityDetails.find({}, function (err, cityDetails) {
    res.render("queryRequest", {
      cityDetailsLists: cityDetails,
      booking_details: "",
    });
  });
});

// Query Request filter
router.post("/queryRequest", function (req, res) {
  console.log(req.body.selectCity);
  console.log(req.body.status);
  console.log(req.body.start_date);
  console.log(req.body.end_date);

  Form.find(
    { city: req.body.selectCity, status: req.body.status },
    function (err, form) {
      CityDetails.find({}, function (err, cityDetails) {
        res.render("queryRequest", {
          cityDetailsLists: cityDetails,
          booking_details: form,
        });
      });
    }
  );
});

// Handle user details
router.post("/handleuser", function (req, res) {
  Form.find({ email: req.body.email }, function (err, form) {
    BookedDetails.find(
      { emailId: req.body.email },
      function (err, bookedDetail) {
        res.render("handleuser", {
          booking_details: form,
          BookedDetail: bookedDetail,
        });
      }
    );
  });
});

// Update booking details
router.post("/bookedForYouDetails", function (req, res) {
  if (req.body.status == "Tour Cancelled") {
    BookedDetails.deleteOne({ tokennumber: req.body.token }, function (err) {
      if (err) {
        console.log(err);
      }
    });
    Form.deleteOne({ tokenNumber: req.body.token }, function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/request");
  } else {
    global.user_status = req.body.status;
    global.user_email = req.body.emailid;

    BookedDetails.updateOne(
      { emailId: req.body.emailid },
      {
        $set: {
          status: req.body.status,
          city: req.body.city,
          package: req.body.package,
          airlines: req.body.flightName,
          origin: req.body.Origin,
          flightDepartureDate: req.body.flightDepartureDate,
          flightDepartureTime: req.body.flightDepartureTime,
          flightArrivalDate: req.body.flightArrivalDate,
          flightArrivalTime: req.body.flightArrivalTime,
          PNRnumber: req.body.pnr,
          ticketnumber: req.body.ticketNumber,
          hotellocation: req.body.allotedHotelLocation,
          hotelname: req.body.allotedHotelName,
          Roomnumber: req.body.roomNumber,
          checkinDate: req.body.checkInDate,
          checkoutdate: req.body.checkOutDate,
        },
      }
    )
      .then((result) => {
        const { matchedCount, modifiedCount } = result;
      })
      .catch((err) => console.error(`Failed to update booking: ${err}`));

    Form.updateOne(
      { email: req.body.emailid },
      {
        $set: {
          Status: req.body.status,
        },
      }
    )
      .then((result) => {
        const { matchedCount, modifiedCount } = result;
      })
      .catch((err) => console.error(`Failed to update form: ${err}`));

    res.redirect("/request");
  }
});

// Reports routes
router.get("/report1", function (req, res) {
  res.render("report1");
});

router.get("/report2", function (req, res) {
  res.render("report2");
});

router.get("/report3", function (req, res) {
  res.render("report3");
});

router.get("/report4", function (req, res) {
  res.render("report4");
});

router.get("/report5", function (req, res) {
  res.render("report5");
});

// Download file
router.post("/download", function (req, res) {
  Form.find({ file: req.body.download }, function (err, form) {
    var x = __dirname.replace("routes", "") + "/uploads/" + form[0].file;
    res.download(x);
  });
});

module.exports = router;

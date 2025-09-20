const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const randomstring = require("random-string-gen");
const router = express.Router();
const { Form, BookedDetails, Package } = require("../models");
const { upload } = require("../config/middleware");

// Booking form page
router.get("/details", function (req, res) {
  res.render("bookingForm", {
    name: global.reviewname,
  });
});

// Submit booking form and generate token
router.post("/token", upload.single("ScannedCopies"), function (req, res) {
  global.randomtoken = randomstring({ length: 10, type: "alphanumeric" });
  console.log(global.randomtoken);

  var date_ob = new Date();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();

  let today = new Date().toISOString().slice(0, 10);
  let to = new Date();
  const weekday = [
    "Sunday -",
    "Monday -",
    "Tuesday -",
    "Wednesday -",
    "Thursday -",
    "Friday -",
    "Saturday -",
  ];

  let day = weekday[to.getDay()];
  var date1 = day + today;
  var time = hours + ":" + minutes + ":" + seconds;

  const new_form = new Form({
    entry_email: global.entryEmail,
    is_local: req.body.flexRadioDefault,
    city: global.selectedCity,
    package: global.selectedPackage,
    booking_date: date1,
    time: time,
    dp: global.profilephoto,
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    nationality: req.body.country,
    isd_code: req.body.isd_code,
    mobile_number: req.body.mobile_number,
    iqama_bataqa_number: req.body.iqama_number,
    passport_number: req.body.passport_number,
    passport_issued_place: req.body.passport_issued_place,
    passport_issued_on: req.body.passport_issued_on,
    valid_till: req.body.valid_till,
    adult_count: req.body.adult_count,
    children_count: req.body.children_count,
    departure_city: req.body.departureCity,
    arrival_date: req.body.arrival_date,
    departure_date: req.body.departure_date,
    vcode: req.body.vcode,
    file: req.file.filename,
    Status: "Under Processing",
    tokenNumber: global.randomtoken,
  });

  new_form.save();

  const initial_data = new BookedDetails({
    name: req.body.name,
    tokennumber: global.randomtoken,
    emailId: req.body.email,
    status: "Under Processing",
    entry_email: global.entryEmail,
  });

  initial_data.save();
  res.render("token", { tokenID: global.randomtoken, name: global.reviewname });
});

// Check booking status
router.post("/seeStatus", function (req, res) {
  console.log(req.body.giventoken);

  BookedDetails.find(
    { tokennumber: req.body.giventoken },
    function (err1, BookedDetail) {
      if (BookedDetail.length == 0) {
        res.sendFile(__dirname.replace("routes", "") + "/wrongtoken.html");
      } else {
        global.user_status = BookedDetail[0].status;

        if (BookedDetail[0].package) {
          Package.find(
            { packageName: BookedDetail[0].package },
            function (err2, package) {
              const doc = new PDFDocument({ margin: 10 });
              doc.image("images/Group 44.png", {
                align: "center",
                valign: "center",
                width: 600,
                height: 750,
              });

              doc
                .text(` ${BookedDetail[0].name}`, 80, 80)
                .text(` ${BookedDetail[0].status}`, 80, 108)
                .text(` ${BookedDetail[0].emailId}`, 80, 133)
                .text(` ${BookedDetail[0].tokennumber}`, 420, 84)
                .text("16 April 2022", 460, 108)
                .text("26 April 2022", 440, 133)
                .text(` ${BookedDetail[0].city}`, 22, 238)
                .text(` ${package[0].packageName}`, 100, 238)
                .text(` ${package[0].packageType}`, 280, 238)
                .text(` ${package[0].packageDays}`, 380, 238)
                .text(` ${package[0].packagePrice} SAR`, 470, 238)
                .text(` ${BookedDetail[0].airlines}`, 25, 360)
                .text(` ${BookedDetail[0].ticketnumber}`, 130, 360)
                .text(` ${BookedDetail[0].flightDepartureDate}`, 220, 355)
                .text(` ${BookedDetail[0].flightDepartureTime}`, 220, 372)
                .text(` ${BookedDetail[0].origin}`, 325, 360)
                .text(` ${BookedDetail[0].flightArrivalDate}`, 420, 355)
                .text(` ${BookedDetail[0].flightArrivalTime}`, 420, 372)
                .text(` ${BookedDetail[0].city}`, 530, 360)
                .text(` ${BookedDetail[0].hotelname}`, 22, 490)
                .text(` ${BookedDetail[0].Roomnumber}`, 150, 490)
                .text(` ${BookedDetail[0].checkinDate}`, 225, 490)
                .text(` ${BookedDetail[0].checkoutdate}`, 325, 490)
                .text(` ${BookedDetail[0].hotellocation}`, 430, 480)
                .fontSize(10);

              doc.end();
              global.pdfName = "uploads/" + BookedDetail[0].name + ".pdf";

              doc.pipe(
                fs.createWriteStream("uploads/" + BookedDetail[0].name + ".pdf")
              );
            }
          );
        }

        Form.find(
          { tokenNumber: req.body.giventoken },
          function (req, singlerowdetails) {
            res.render("individualBookingDetails", {
              Details: BookedDetail,
              Status: global.user_status,
              name: global.reviewname,
              booking_details: singlerowdetails,
            });
          }
        );
      }
    }
  );
});

// Download receipt
router.post("/downloadReceipt", function (req, res) {
  console.log("Download receipt requested");
  var x = __dirname.replace("routes", "") + "/" + global.pdfName;
  res.download(x);
});

module.exports = router;

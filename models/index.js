const mongoose = require("mongoose");

// Review Schema
const reviewSchema = new mongoose.Schema({
  review: String,
  dp: String,
  name: String,
});
const UserReviews = mongoose.model("UserReview", reviewSchema);

// Booked Details Schema
const bookedDetailsSchema = new mongoose.Schema({
  entry_email: String,
  name: String,
  package: String,
  city: String,
  tokennumber: String,
  emailId: String,
  status: String,
  airlines: String,
  flightDepartureDate: String,
  flightDepartureTime: String,
  flightArrivalDate: String,
  flightArrivalTime: String,
  PNRnumber: Number,
  ticketnumber: Number,
  hotellocation: String,
  hotelname: String,
  Roomnumber: String,
  checkinDate: String,
  checkoutdate: String,
  origin: String,
});
const BookedDetails = mongoose.model("BookedDetails", bookedDetailsSchema);

// Form Schema
const formSchema = new mongoose.Schema({
  entry_email: String,
  dp: String,
  city: String,
  package: String,
  booking_date: String,
  time: String,
  is_local: String,
  name: String,
  gender: String,
  email: String,
  nationality: String,
  isd_code: String,
  mobile_number: String,
  iqama_bataqa_number: String,
  passport_number: String,
  passport_issued_place: String,
  passport_issued_on: String,
  valid_till: String,
  adult_count: Number,
  children_count: Number,
  departure_city: String,
  arrival_date: String,
  departure_date: String,
  vcode: String,
  file: String,
  Status: String,
  tokenNumber: String,
});
const Form = mongoose.model("Form", formSchema);

// Package Schema
const packageSchema = new mongoose.Schema({
  packageid: String,
  packageCity: String,
  packageName: String,
  packageDays: Number,
  packagePrice: Number,
  packageType: String,
  packageImg: String,
});
const Package = mongoose.model("package", packageSchema);

// City Details Schema
const cityDetailsSchema = new mongoose.Schema({
  cityName: String,
  cityImage: String,
  cityDescription: String,
  latestAnnouncments: Array,
  tourplace1: String,
  tourImage1: String,
  tourDescription1: String,
  tourplace2: String,
  tourImage2: String,
  tourDescription2: String,
  tourplace3: String,
  tourImage3: String,
  tourDescription3: String,
});
const CityDetails = mongoose.model("CityDetails", cityDetailsSchema);

module.exports = {
  UserReviews,
  BookedDetails,
  Form,
  Package,
  CityDetails,
};

const express = require("express");
const https = require("https");
const router = express.Router();
const { CityDetails, Package } = require("../models");
const { multipleUpload } = require("../config/middleware");

// City details page
router.get("/city", function (req, res) {
  const url1 =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    global.selectedCity +
    "&units=metric&appid=3d7f0e8cbe5fdb45d68fdd4206063952";

  https
    .get(url1, function (response) {
      let data = "";

      // Collect data chunks
      response.on("data", function (chunk) {
        data += chunk;
      });

      // When response is complete
      response.on("end", function () {
        try {
          const weatherData = JSON.parse(data);

          // Check if weatherData has the expected structure
          if (weatherData.coord && weatherData.main && weatherData.weather) {
            global.xcoordinate = weatherData.coord.lat;
            global.ycoordinate = weatherData.coord.lon;
            global.temperature = weatherData.main.temp;
            global.description = weatherData.weather[0].description;
            var icon = weatherData.weather[0].icon;
            global.image_url =
              "http://openweathermap.org/img/wn/" + icon + "@2x.png";
          } else {
            // Set default values if weather data is invalid
            console.log("Invalid weather data received:", weatherData);
            global.xcoordinate = 0;
            global.ycoordinate = 0;
            global.temperature = "N/A";
            global.description = "Weather data unavailable";
            global.image_url = "";
          }

          // Now fetch city and package data and render
          fetchCityDataAndRender(res);
        } catch (error) {
          console.log("Error parsing weather data:", error);
          // Set default values on error
          global.xcoordinate = 0;
          global.ycoordinate = 0;
          global.temperature = "N/A";
          global.description = "Weather data unavailable";
          global.image_url = "";

          // Still render the page with default weather data
          fetchCityDataAndRender(res);
        }
      });
    })
    .on("error", function (error) {
      console.log("Weather API request error:", error);
      // Set default values on request error
      global.xcoordinate = 0;
      global.ycoordinate = 0;
      global.temperature = "N/A";
      global.description = "Weather data unavailable";
      global.image_url = "";

      // Still render the page with default weather data
      fetchCityDataAndRender(res);
    });
});

// Helper function to fetch city data and render
function fetchCityDataAndRender(res) {
  CityDetails.find(
    { cityName: global.selectedCity },
    function (err, cityDetail) {
      if (err) {
        console.log("Error fetching city details:", err);
        return res.status(500).send("Error fetching city details");
      }

      Package.find(
        { packageCity: global.selectedCity },
        function (err, packageDetails) {
          if (err) {
            console.log("Error fetching package details:", err);
            return res.status(500).send("Error fetching package details");
          }

          res.render("city", {
            selectedCity: cityDetail,
            temperature: global.temperature,
            day: global.day,
            description: global.description,
            image_url: global.image_url,
            package: packageDetails,
            name: global.reviewname,
            x: global.xcoordinate,
            y: global.ycoordinate,
          });
        }
      );
    }
  );
}

// Select city
router.post("/common", function (req, res) {
  global.selectedCity = req.body.city_name;
  res.redirect("/city");
});

// Create City page
router.get("/createCity", function (req, res) {
  res.render("createCity", { success: "" });
});

// Create City POST
router.post("/createCity", multipleUpload, function (req, res) {
  var str = req.body.latest_announcments;
  var arr = str.split("#");

  const singleCity = new CityDetails({
    cityName: req.body.city_name,
    cityImage: req.files.cityImage[0].filename,
    cityDescription: req.body.city_description,
    latestAnnouncments: arr,
    tourplace1: req.body.tour_name1,
    tourImage1: req.files.tourImg1[0].filename,
    tourDescription1: req.body.tour1description,
    tourplace2: req.body.tour_name2,
    tourImage2: req.files.tourImg2[0].filename,
    tourDescription2: req.body.tour2description,
    tourplace3: req.body.tour_name3,
    tourImage3: req.files.tourImg3[0].filename,
    tourDescription3: req.body.tour3description,
  });

  singleCity.save();
  res.render("createCity", { success: "Successfully created City" });
});

// Delete City page
router.get("/deleteCity", function (req, res) {
  CityDetails.find({}, function (err, cityDetails) {
    res.render("deleteCity", {
      cityDetailsLists: cityDetails,
      success: "",
    });
  });
});

// Delete City POST
router.post("/deleteCity", function (req, res) {
  CityDetails.deleteOne({ cityName: req.body.todeleteCity }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/popupDeleteCity");
});

// Delete City confirmation
router.get("/popupDeleteCity", function (req, res) {
  CityDetails.find({}, function (err, cityDetails) {
    res.render("deleteCity", {
      cityDetailsLists: cityDetails,
      success: "City Deleted Successfully",
    });
  });
});

module.exports = router;

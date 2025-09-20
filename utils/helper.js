const randomstring = require("random-string-gen");

// Generate random token
const generateToken = (length = 10) => {
  return randomstring({ length, type: "alphanumeric" });
};

// Format current date
const getCurrentDate = () => {
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
  return day + today;
};

// Format current time
const getCurrentTime = () => {
  var date_ob = new Date();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();
  return hours + ":" + minutes + ":" + seconds;
};

// Weather API URL generator
const getWeatherURL = (city) => {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3d7f0e8cbe5fdb45d68fdd4206063952`;
};

// Weather icon URL generator
const getWeatherIconURL = (icon) => {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
};

module.exports = {
  generateToken,
  getCurrentDate,
  getCurrentTime,
  getWeatherURL,
  getWeatherIconURL,
};

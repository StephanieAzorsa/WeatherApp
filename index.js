let currentTime = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let numberDays = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "13th",
  "14th",
  "15th",
  "16th",
  "17th",
  "18th",
  "19th",
  "20th",
  "21st",
  "22nd",
  "23rd",
  "24th",
  "25th",
  "26th",
  "27th",
  "28th",
  "29th",
  "30th",
  "31st",
];

function showDate() {
  let currentDate = numberDays[currentTime.getDate() - 1];
  let currentMonth = months[currentTime.getMonth()];
  let currentDay = days[currentTime.getDay()];

  let date = document.querySelector("#current-day");
  date.innerHTML = `${currentDay}, ${currentDate} ${currentMonth}`;
  return date;
}

function showTime() {
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();

  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  if (currentHours < 12) {
    currentTime = `${currentHours}:${currentMinutes} a. m.`;
  } else {
    currentTime = `${currentHours}:${currentMinutes} p. m.`;
  }

  let time = document.querySelector("#current-time");
  time.innerHTML = `Last updated: ${currentTime}`;
  return time;
}

function displayCity(cityInput) {
  let apiKey = "0f7352eebb0e963e47cf1be0dd037d51";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function searchingCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  displayCity(cityInput);
}

function showWeather(response) {
  document.querySelector("#current-temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )} ºC`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector(
    "#wind"
  ).innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  document.querySelector(
    "#description"
  ).innerHTML = `${response.data.weather[0].main}`;
  document.querySelector("#city").innerHTML = `${response.data.name}`;
  document.querySelector("#departament").innerHTML = `${response.data.name}, `;
  document.querySelector("#country").innerHTML = `${response.data.sys.country}`;
  document
    .querySelector("#icon-weather")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document
    .querySelector("#icon-weather")
    .setAttribute("alt", `response.data.weather[0].description`);

  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function formatHour(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function getForecast(coordinates) {
  let apiKey = "0f7352eebb0e963e47cf1be0dd037d51";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastDaily);
  axios.get(apiUrl).then(displayForecastHourly);
}

function displayForecastDaily(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-daily");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayForecastHourly(response) {
  let forecast = response.data.hourly;
  let forecastElement = document.querySelector("#forecast-hourly");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastHour, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="weather-forecast-date">${formatHour(forecastHour.dt * 1000)}
        </div>
          <img
            src="http://openweathermap.org/img/wn/${
              forecastHour.weather[0].icon
            }@2x.png"
            alt=""
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${Math.round(
              forecastHour.temp
            )}° </span>
            <span class="weather-forecast-temperature-min"> ${Math.round(
              forecastHour.temp
            )}° </span>
          </div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showCurrentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "0f7352eebb0e963e47cf1be0dd037d51";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function buttonFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)} ºK`;
}

function buttonCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)} ºC`;
}

window.addEventListener("load", function () {
  showDate();
  showTime();

  let form = document.querySelector("#search-form");
  form.addEventListener("submit", searchingCity);

  displayCity("Athens");

  document
    .querySelector("#fahrenheit")
    .addEventListener("click", buttonFahrenheitTemperature);
  document
    .querySelector("#celsuis")
    .addEventListener("click", buttonCelsiusTemperature);
  document
    .querySelector("#current-location")
    .addEventListener("click", getCurrentPosition);

  getForecast();
});

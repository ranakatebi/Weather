function formatDate(now) {
  let year = now.getFullYear();
  let date = now.getDate();
  let hour = now.getHours();
  let min = now.getUTCMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (min < 10) {
    min = `0${min}`;
  }

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

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let timeValue = ` ${day} ${date} ${month} ${hour}:${min}`;
  let gettoday = document.querySelector("div #time");
  gettoday.innerHTML = timeValue;
}
formatDate(new Date());
//////////////////////////////////////////////////////////////////////////////

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="container week">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML += `
     
                <div class="row align-items-start">
                  <div class="col">${formatDay(forecastDay.dt)}</div>
                  <div class="col">
                    <img
                       src="image/${forecastDay.weather[0].icon}.png"
              alt=""
              width="42"
                    />
                  </div>
                  <div class="col"> <span class="weather-forecast-temperature-max"> ${Math.round(
                    forecastDay.temp.max
                  )}°C / </span>
              <span class="weather-forecast-temperature-min"> ${Math.round(
                forecastDay.temp.min
              )}°C </span></div>
                </div>
     `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "89df1cb5a298dd0aab1a82b6c4062896";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

//////////////////////////////////////////////////////////////////////////////
function displayWeatherCondition(response) {
  let iconElement = document.querySelector("#icon");
  temperature = response.data.main.temp;

  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#city-temp").innerHTML = Math.round(temperature);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  temperature = response.data.main.temp;
  document.querySelector("#temp_max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#temp_min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#feels_like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;

  iconElement.setAttribute("src", `image/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);

  function convertToFahrenheit(event) {
    event.preventDefault();
    c.classList.remove("active");
    f.classList.add("active");
    let Celsius = document.querySelector("#city-temp");
    let Farenheit = Math.round((temperature * 9) / 5 + 32);
    Celsius.innerHTML = Farenheit;
  }
  let findf = document.querySelector("#f");
  findf.addEventListener("click", convertToFahrenheit);

  function convertToCelsius(event) {
    event.preventDefault();
    c.classList.add("active");
    f.classList.remove("active");
    let Celsius = document.querySelector("#city-temp");
    Celsius.innerHTML = Math.round(temperature);
  }
  let findc = document.querySelector("#c");
  findc.addEventListener("click", convertToCelsius);
}

function searchCity(city) {
  let apiKey = "89df1cb5a298dd0aab1a82b6c4062896";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "89df1cb5a298dd0aab1a82b6c4062896";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let temperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#loc");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Zurich");

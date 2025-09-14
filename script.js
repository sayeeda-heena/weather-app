const apiKey = "cca3e744a6d40b99f2d1ce41f213e377";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const  forecastContainer = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if(city)  {
    getWeather(city);
    getForecast(city);
  }else{
    weatherResult.innerHTML = "<p>Please enter city name</p>"
  }
});

// Current weather
async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
  
    weatherResult.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <h3>${Math.round(data.main.temp)}°C</h3>
      <p>${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
    
  }catch(error) {
       weatherResult.innerHTML = `<p>${error.message}</p>`;
  }
}

// 5-day forecast
async function getForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forecast not found");
    const data = await response.json();
    
     // Filter one forecast per day (12:00 PM)
    const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));
     
    forecastContainer.innerHTML = dailyForecast.map(day => {
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
      return `
        <div class="forecast-card">
          <h4>${date}</h4>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
          <p>${Math.round(day.main.temp)}°C</p>
          <p>${day.weather[0].main}</p>
        </div>
      `;
    }).join("");
    
  }catch(error){
      forecastContainer.innerHTML = `<p>${error.message}</p>`;
  }
}






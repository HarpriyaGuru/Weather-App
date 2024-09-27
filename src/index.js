//  On click on search button
function submitCity() {
    const city = document.getElementById("city").value;
    const weatherReport = document.getElementById("weatherReport");

    if (!city) {
        weatherReport.innerHTML = "Please enter a valid city name.";
        return;
    }

    fetchCurrentWeather(city);
}

async function fetchCurrentWeather(city) {
    const weatherReport = document.getElementById("weatherReport");
    const API = "a562058c790d145fb8252a7b0b5ed5b8";
    const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?appid=${API}&q=${city}&units=metric`;

    try {
        const response = await fetch(currentWeatherAPI);
        
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }

        const data = await response.json();

        if (data.cod !== 200) {
            weatherReport.innerHTML = "City not found. Please enter a valid city name.";
            return;
        }

        displayWeather(data);
        fetchForecast(data.name); // Fetch forecast using the city name
    } catch (error) {
        weatherReport.innerHTML = `Error: ${error.message}`;
    }
}

//-------------------------getting current location of the user--------------------------------------
document.getElementById('CurrentLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }  
});

async function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat, "+", lon);
    
    const API = "a562058c790d145fb8252a7b0b5ed5b8"; // Replace with your actual API key
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        const data = await response.json();
        console.log(data);
        displayWeather(data);
        fetchForecast(data.name); // Fetch forecast using the city name
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayWeather(data) {
    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = ""; // Clear previous content

    const sideCard = document.createElement('div');
    sideCard.className = "side-bar border p-8 rounded-2xl shadow-lg shadow-white text-center";
    sideCard.innerHTML = `
        <img class="weatherIcon m-auto" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        <div class="city p-1">${data.name}, ${data.sys.country}</div>
        <h2 class="temperature font-extrabold p-1">${data.main.temp} °C</h2>
        <div class="feelsLike p-1">Feels like: ${data.main.feels_like} °C</div>
        <div class="description p-1" id="desc">${data.weather[0].description}</div>
        <div class="date font-bold p-1">${new Date(data.dt * 1000).toLocaleString()}</div>
    `;
    cardsContainer.appendChild(sideCard);

    // Full details
    const fullDetail = document.createElement("div");
    fullDetail.className = "side-bar border p-8 rounded-2xl shadow-lg shadow-white text-center";
    fullDetail.innerHTML = `
        <h2 class="heading font-bold mb-4 text-4xl text-red-800">Today's Highlights</h2>
        <div class="highlights grid grid-cols-3 gap-1">
            <div class="humidity flex flex-col items-center justify-between bg-slate-100 p-2">
                Humidity
                <i class="fa-solid fa-water text-blue-500"></i>  
                <h1 id="HValue" class="text-lg">${data.main.humidity}%</h1>
            </div>
            <div class="wind-speed flex flex-col items-center justify-between bg-slate-100 p-2">
                Wind Speed
                <i class="fa-solid fa-wind text-blue-500"></i>  
                <h1 id="WValue" class="text-lg">${data.wind.speed} m/s</h1>
            </div>
            <div class="sun flex flex-col justify-around bg-slate-100 p-2">
                <span class="flex items-center">
                    <i class="fa-regular fa-sun text-yellow-500 py-4"></i>  
                    <p><span id="SRValue" class="px-2">${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</span> Sunrise</p>
                </span>
                <span class="flex items-center">
                    <i class="fa-regular fa-sun text-yellow-500 py-4"></i>  
                    <p><span id="SSValue" class="px-2">${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</span> Sunset</p>
                </span>
            </div>
            <div class="clouds flex flex-col items-center justify-between bg-slate-100 p-2">
                Clouds
                <i class="fa-solid fa-cloud text-gray-500"></i>  
                <h1 id="CValue" class="text-lg">${data.clouds.all}%</h1>
            </div>
            <div class="visibility flex flex-col items-center justify-between bg-slate-100 p-2">
                Visibility
                <i class="fa-solid fa-eye text-gray-500"></i>  
                <h1 id="VValue" class="text-lg">${data.visibility / 1000} km</h1>
            </div>
            <div class="pressure flex flex-col items-center justify-between bg-slate-100 p-2">
                Pressure
                <i class="fa-solid fa-thermometer-three-quarters text-gray-500 p-2"></i>  
                <h1 id="PValue" class="text-lg">${data.main.pressure} hPa</h1>
            </div>
        </div>
    `;
    cardsContainer.appendChild(fullDetail);
}

async function fetchForecast(city) {
    const forecastWeather = document.querySelector(".forecastWeather");
    const API = "a562058c790d145fb8252a7b0b5ed5b8";
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?appid=${API}&q=${city}&units=metric`;

    try {
        const response = await fetch(forecastAPI);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.log(error);
        forecastWeather.innerHTML = `Error: ${error.message}`;       
    }    
}

function displayForecast(data) {
    const forecastWeather = document.querySelector(".forecastWeather");
    forecastWeather.innerHTML = ""; // Clear previous forecast content

    data.list.forEach(item => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <div>${new Date(item.dt * 1000).toLocaleDateString()} ${new Date(item.dt * 1000).toLocaleTimeString()}</div>
            <div>Temp: ${item.main.temp} °C</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
            <div>${item.weather[0].description}</div>
        `;
        forecastWeather.appendChild(forecastItem);
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}
//-------------------------getting current location of the user--------------------------------------

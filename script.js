const cityInput = document.getElementById("cityInput");
const getWeatherButton = document.getElementById("getWeather");
const weatherData = document.getElementById("weatherData");
const apiKey = "40b097d80f9732ac65ca9ba2bde520bd";

getWeatherButton.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
        }
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherData.innerHTML = "<p>City not found or API error.</p>";
    }
}

function displayWeatherData(data) {
    if (data.cod === "404") {
        weatherData.innerHTML = "<p>City not found.</p>";
        return;
    }
    const { name, main, weather, wind } = data;
    const temperature = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const iconCode = weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    weatherData.innerHTML = `
        <h2>${name}</h2>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>🌡️ Temperature: ${temperature}°C</p>
        <p>☁️ Description: ${description}</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>🌬️ Wind Speed: ${windSpeed} m/s</p>
        <button id="saveToFavorites">Save to Favorites</button>
    `;

    document.getElementById("saveToFavorites").addEventListener("click", () => {
        saveToFavorites(name);
    });
}

function saveToFavorites(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const messageContainer = document.getElementById("messageContainer");

    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
        showMessage(`${city} has been added to your favorites.`, "success");
    } else {
        showMessage(`${city} is already in your favorites.`, "info");
    }
}

function removeFromFavorites(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((favorite) => favorite !== city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    showMessage(`${city} has been removed from your favorites.`, "success");
}

function displayFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.innerHTML = "";

    favorites.forEach((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = city;

        // Add a "Remove" button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.style.backgroundColor = "#ff4d4d";
        removeButton.style.color = "white";
        removeButton.style.border = "none";
        removeButton.style.borderRadius = "4px";
        removeButton.style.cursor = "pointer";

        // Stop event propagation when clicking the "Remove" button
        removeButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the parent click event
            removeFromFavorites(city);
        });

        listItem.appendChild(removeButton);

        // Add click event to fetch weather data only when clicking the city name
        listItem.addEventListener("click", () => {
            getWeatherData(city);
        });

        favoritesList.appendChild(listItem);
    });
}

function showMessage(message, type) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.style.display = "block"; // Show the message container
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`; // Add a class based on the message type (e.g., success, info, error)

    // Automatically hide the message after 3 seconds
    setTimeout(() => {
        messageContainer.textContent = "";
        messageContainer.className = "message";
        messageContainer.style.display = "none"; // Hide the message container
    }, 1500);
}

// Call displayFavorites on page load
document.addEventListener("DOMContentLoaded", displayFavorites);

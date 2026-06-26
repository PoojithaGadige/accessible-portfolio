// Selecting DOM display targets
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// ASYNCHRONOUS ENGINE: Fetch data from REST API
async function getWeatherData() {
    const city = cityInput.value.trim();
    if (!city) return;

    // Reset UI view states before firing network query
    errorMessage.style.display = 'none';
    weatherDisplay.style.display = 'none';

    try {
        // Fetching structural JSON format using standard async endpoints
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        
        // Comprehensive Error Handling for Failed Requests
        if (!response.ok) {
            throw new Error('City data not found. Please verify spelling.');
        }

        // Parsing nested raw JSON stream
        const data = await response.json();
        
        // Target and Extract complex nested response payload layers
        const currentCondition = data.current_condition[0];
        const nearestArea = data.nearest_area[0];

        // Dynamic Text DOM Injections
        locationName.textContent = `${nearestArea.areaName[0].value}, ${nearestArea.country[0].value}`;
        temperature.textContent = `${currentCondition.temp_C}°C`;
        humidity.textContent = `${currentCondition.humidity}%`;
        windSpeed.textContent = `${currentCondition.windspeedKmph} km/h`;

        // Make data display panel visible
        weatherDisplay.style.display = 'block';

    } catch (error) {
        // Fallback catch loop processing runtime network failures
        errorMessage.textContent = error.message || 'Network failure. Please try again later.';
        errorMessage.style.display = 'block';
    }
}

// Attach event tracking triggers
searchBtn.addEventListener('click', getWeatherData);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeatherData();
});

// 1. GLOBAL STATE MANAGERS
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 2. CENTRALIZED ROUTE SYSTEM
const routes = {
    '/': () => `
        <section>
            <h1>Welcome to my Capstone Portfolio Hub</h1>
            <p>This production hub combines dynamic state management engines and asynchronous API connections into a unified framework.</p>
        </section>
    `,
    
    '/contact': () => `
        <section style="max-width: 500px;">
            <h1>Contact Integration</h1>
            <form action="#" method="POST" style="margin-top:1rem;">
                <div style="margin-bottom: 1rem;">
                    <label for="c-name" style="display:block; font-weight:bold; margin-bottom: 0.5rem;">Name</label>
                    <input type="text" id="c-name" style="width:100%; padding:0.5rem;">
                </div>
                <button type="submit" style="padding:0.5rem 1rem; background:var(--accent); color:white; border:none; cursor:pointer;">Submit</button>
            </form>
        </section>
    `,

    // FIX FOR THE 404 ERROR: Added the Weather view template directly into the router
    '/weather': () => `
        <section style="max-width: 500px; margin: 0 auto; text-align: center;">
            <h1>Live Weather Dashboard</h1>
            <p>Fetch real-time weather analytics using asynchronous API requests.</p>

            <div style="margin: 2rem 0; display: flex; gap: 0.5rem;">
                <input type="text" id="city-input" placeholder="Enter city name (e.g., London)" style="flex-grow: 1; padding: 0.75rem;" aria-label="City Name Input">
                <button id="search-btn" style="padding: 0.75rem 1.5rem; background: var(--accent); color: white; border: none; cursor: pointer;">Search</button>
            </div>

            <p id="error-message" style="color: #dc2626; font-weight: bold; display: none;" role="alert"></p>

            <div id="weather-display" style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 2rem; display: none;">
                <h2 id="location-name" style="margin-bottom: 1rem;">City Name</h2>
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--accent); margin-bottom: 1rem;" id="temperature">--°C</div>
                
                <div style="display: flex; justify-content: space-around; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <div>
                        <small style="color: var(--text-secondary); display: block;">Humidity</small>
                        <strong id="humidity">--%</strong>
                    </div>
                    <div>
                        <small style="color: var(--text-secondary); display: block;">Wind Speed</small>
                        <strong id="wind-speed">-- m/s</strong>
                    </div>
                </div>
            </div>
        </section>
    `
};

// 3. ROUTER CONTROLLER ENGINE
function router() {
    const appTarget = document.getElementById('app');
    const path = window.location.hash.slice(1) || '/';
    
    const renderContent = routes[path] || (() => `<section><h1>404 Error</h1><p>View layer route missing.</p></section>`);
    appTarget.innerHTML = renderContent();

    // Re-bind JavaScript logic listeners after injection occurs
    if (path === '/weather') {
        initWeatherLogic();
    }
}

// 4. WEATHER FUNCTIONALITY WRAPPER
function initWeatherLogic() {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');
    const weatherDisplay = document.getElementById('weather-display');

    if (!searchBtn) return; // Guard clause if elements aren't rendered yet

    async function getWeatherData() {
        const city = cityInput.value.trim();
        if (!city) return;

        errorMessage.style.display = 'none';
        weatherDisplay.style.display = 'none';

        try {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            if (!response.ok) throw new Error('City data not found.');

            const data = await response.json();
            
            document.getElementById('location-name').textContent = `${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].country[0].value}`;
            document.getElementById('temperature').textContent = `${data.current_condition[0].temp_C}°C`;
            document.getElementById('humidity').textContent = `${data.current_condition[0].humidity}%`;
            document.getElementById('wind-speed').textContent = `${data.current_condition[0].windspeedKmph} km/h`;

            weatherDisplay.style.display = 'block';
        } catch (error) {
            errorMessage.textContent = 'City not found or network error.';
            errorMessage.style.display = 'block';
        }
    }

    searchBtn.addEventListener('click', getWeatherData);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getWeatherData();
    });
}

// Event hooks for structural state management
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

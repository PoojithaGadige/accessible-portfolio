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
    `,

    // FIX FOR THE TASK 404 ERROR: Added the To-Do View Template
    '/todo': () => `
        <section style="max-width: 600px; margin: 0 auto;">
            <h1>JavaScript Task Manager</h1>
            <p>A state-driven application managing local persistence and event delegation.</p>

            <div style="margin: 2rem 0; display: flex; gap: 0.5rem;">
                <input type="text" id="todo-input" placeholder="What needs to be done?" style="flex-grow: 1; padding: 0.75rem;" aria-label="New task description">
                <button id="add-btn" style="padding: 0.75rem 1.5rem; background: var(--accent); color: white; border: none; cursor: pointer;">Add Task</button>
            </div>

            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;" id="filter-controls">
                <button data-filter="all" style="padding: 0.25rem 0.7rem; cursor: pointer; font-weight: ${currentFilter === 'all' ? 'bold' : 'normal'};">All</button>
                <button data-filter="active" style="padding: 0.25rem 0.7rem; cursor: pointer; font-weight: ${currentFilter === 'active' ? 'bold' : 'normal'};">Active</button>
                <button data-filter="completed" style="padding: 0.25rem 0.7rem; cursor: pointer; font-weight: ${currentFilter === 'completed' ? 'bold' : 'normal'};">Completed</button>
            </div>

            <ul id="todo-list" style="list-style: none; padding: 0;"></ul>
        </section>
    `
};

// 3. ROUTER CONTROLLER ENGINE
function router() {
    const appTarget = document.getElementById('app');
    const path = window.location.hash.slice(1) || '/';
    
    const renderContent = routes[path] || (() => `<section><h1>404 Error</h1><p>View layer route missing.</p></section>`);
    appTarget.innerHTML = renderContent();

    // Dynamically boot script operational logics based on path link
    if (path === '/weather') {
        initWeatherLogic();
    } else if (path === '/todo') {
        initTodoLogic();
    }
}

// 4. WEATHER FUNCTIONALITY WRAPPER
function initWeatherLogic() {
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');
    const weatherDisplay = document.getElementById('weather-display');

    if (!searchBtn) return;

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

// 5. TO-DO FUNCTIONALITY WRAPPER
function initTodoLogic() {
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const filterControls = document.getElementById('filter-controls');

    if (!todoList) return;

    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.padding = '0.75rem';
            li.style.backgroundColor = 'var(--bg-surface)';
            li.style.border = '1px solid var(--border-color)';
            li.style.marginBottom = '0.5rem';
            li.style.alignItems = 'center';

            li.innerHTML = `
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="checkbox" class="toggle-box" data-id="${todo.id}" ${todo.completed ? 'checked' : ''} aria-label="Mark task as complete">
                    <span style="${todo.completed ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${todo.text}</span>
                </div>
                <button class="delete-btn" data-id="${todo.id}" style="background: #dc2626; color: white; border: none; padding: 0.25rem 0.5rem; cursor: pointer;" aria-label="Delete task">Delete</button>
            ];`;
            todoList.appendChild(li);
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') return;

        todos.push({
            id: Date.now().toString(),
            text: text,
            completed: false
        });
        todoInput.value = '';
        renderTodos();
    }

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('toggle-box')) {
            todos = todos.map(todo => todo.id === id ? { ...todo, completed: target.checked } : todo);
            renderTodos();
        } else if (target.classList.contains('delete-btn')) {
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
        }
    });

    filterControls.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentFilter = e.target.getAttribute('data-filter');
            Array.from(filterControls.children).forEach(btn => btn.style.fontWeight = 'normal');
            e.target.style.fontWeight = 'bold';
            renderTodos();
        }
    });

    renderTodos(); // Initial compilation draw
}

// Event hooks for structural state management
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

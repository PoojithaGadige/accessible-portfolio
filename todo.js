// 1. INITIALIZE STATE (Load from localStorage or default to empty array)
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Element Selectors
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const filterControls = document.getElementById('filter-controls');

// 2. RENDER FUNCTION (Reads state and creates DOM elements dynamically)
function renderTodos() {
    todoList.innerHTML = ''; // Clear existing lists

    // Apply active filter logic
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // 'all'
    });

    // Generate elements dynamically
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
        `;
        todoList.appendChild(li);
    });

    // Persist to window.localStorage automatically
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 3. CRUD: CREATE OPERATIONS
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        id: Date.now().toString(), // Unique ID generation
        text: text,
        completed: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    renderTodos();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// 4. EVENT DELEGATION (Listens to parent wrapper container for modern resource efficiency)
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.getAttribute('data-id');

    if (target.classList.contains('toggle-box')) {
        // CRUD: UPDATE OPERATION
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: target.checked } : todo);
        renderTodos();
    } else if (target.classList.contains('delete-btn')) {
        // CRUD: DELETE OPERATION
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }
});

// 5. ADVANCED FILTER SELECTION HANDLING
filterControls.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        currentFilter = e.target.getAttribute('data-filter');
        
        // Update visual design focus button elements
        Array.from(filterControls.children).forEach(btn => btn.style.fontWeight = 'normal');
        e.target.style.fontWeight = 'bold';
        
        renderTodos();
    }
});

// Run rendering script immediately upon user loading the document
renderTodos();

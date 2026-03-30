'use strict';

let tasks = [
    { id: '1', text: 'Зробити Завдання 1 з лабораторної', completed: true, createdAt: '2026-03-30T10:00:00.000Z', updatedAt: '2026-03-30T12:00:00.000Z' },
    { id: '2', text: 'Написати чисті функції для To-Do', completed: false, createdAt: '2026-03-30T14:00:00.000Z', updatedAt: '2026-03-30T14:00:00.000Z' }
];

let currentSort = 'dateCreated';
let editingTaskId = null;


const addTask = (list, text) => {
    const now = new Date().toISOString();
    return [...list, { id: Date.now().toString(), text, completed: false, createdAt: now, updatedAt: now }];
};

const deleteTask = (list, id) => list.filter(t => t.id !== id);

const toggleTaskCompletion = (list, id) =>
    list.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t);

const updateTaskText = (list, id, newText) =>
    list.map(t => t.id === id ? { ...t, text: newText, updatedAt: new Date().toISOString() } : t);

const sortTasks = (list, sortBy) => {
    const copy = [...list];
    switch (sortBy) {
        case 'status': return copy.sort((a, b) => Number(a.completed) - Number(b.completed)); // Невиконані (0) вище за виконані (1)
        case 'dateCreated': return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Новіші вище
        case 'dateUpdated': return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Нещодавно змінені вище
        default: return copy;
    }
};

const els = {
    form: document.getElementById('todo-form'),
    input: document.getElementById('todo-input'),
    list: document.getElementById('todo-list'),
    sorts: document.getElementById('sort-container')
};

const createTaskHTML = (t) => {
    const isEditing = t.id === editingTaskId;

    const contentHTML = isEditing
        ? `<input type="text" class="edit-input" data-id="${t.id}" value="${t.text}" autofocus>`
        : `<span class="task-text ${t.completed ? 'completed' : ''}" data-id="${t.id}">${t.text}</span>`;

    return `
        <li class="task-item fade-in" data-id="${t.id}">
            <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.completed ? 'checked' : ''}>
            ${contentHTML}
            <div class="task-actions">
                ${!isEditing ? `<button class="edit-btn" data-id="${t.id}">✎</button>` : ''}
                <button class="delete-btn" data-id="${t.id}">✖</button>
            </div>
        </li>
    `;
};

const renderTasks = () => {
    const displayList = sortTasks(tasks, currentSort);
    els.list.innerHTML = displayList.length
        ? displayList.map(createTaskHTML).join('')
        : '<li class="empty-message">Немає завдань. Чудовий час для відпочинку!</li>';

    const editInput = document.querySelector('.edit-input');
    if (editInput) {
        editInput.focus();
        // Ставимо курсор в кінець тексту
        editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
    }
};

els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value.trim();
    if (text) {
        tasks = addTask(tasks, text);
        els.input.value = '';
        renderTasks();
    }
});

els.list.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.classList.contains('task-checkbox') || e.target.classList.contains('task-text')) {
        if (e.target.classList.contains('task-text')) {
            tasks = toggleTaskCompletion(tasks, id);
            renderTasks();
        } else if (e.target.type === 'checkbox') {
            tasks = toggleTaskCompletion(tasks, id);
            renderTasks();
        }
    }

    if (e.target.classList.contains('delete-btn')) {
        tasks = deleteTask(tasks, id);
        renderTasks();
    }

    if (e.target.classList.contains('edit-btn')) {
        editingTaskId = id;
        renderTasks();
    }
});

els.list.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('edit-input')) {
        const id = e.target.dataset.id;
        const newText = e.target.value.trim();
        if (newText) {
            tasks = updateTaskText(tasks, id, newText);
        } else {
            tasks = deleteTask(tasks, id);
        }
        editingTaskId = null;
        renderTasks();
    }
});

els.list.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('edit-input') && e.key === 'Enter') {
        e.target.blur();
    }
});

els.sorts.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        currentSort = e.target.dataset.sort;
        Array.from(els.sorts.children).forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        renderTasks();
    }
});
document.addEventListener('DOMContentLoaded', renderTasks);
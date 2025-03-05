document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('#taskList');
    const form = document.querySelector('#taskForm');
    const toggleHiddenCheckbox = document.querySelector('#toggleHiddenTasks');

    let tasks = []; // храним все задачи

    async function loadTasks() {
        const response = await fetch('/tasks');
        tasks = await response.json(); // сохраняем задачи
        renderTasks();
    }

    function renderTasks() {
        container.innerHTML = '';
        tasks.forEach((task) => {
            if (toggleHiddenCheckbox.checked || !task.completed) {
                addTaskToDOM(task); // добавляем задачу в DOM только если она не скрыта
            }
        });
    }

    function addTaskToDOM(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('card', 'mt-2');
        if (task.completed) taskElement.classList.add('hidden-task');

        taskElement.innerHTML = `
            <div class="card-header d-flex align-items-center">
                <input type="checkbox" class="task-checkbox mr-2" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span class="task-text" style="text-decoration: ${task.completed ? 'line-through' : 'none'};">${task.title}</span>
                <button type="button" class="close ml-auto" data-id="${task.id}">&times;</button>
            </div>
            <div class="card-body">${task.description}</div>
        `;
        container.appendChild(taskElement);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDescription').value;

        if (!title || !description) return;
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });

        const newTask = await response.json();
        tasks.push(newTask); // добавляем новую задачу в список
        renderTasks(); // пересоздаём DOM с обновлённым списком
    });

    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('close')) {
            const id = e.target.getAttribute('data-id');
            await fetch(`/tasks/${id}`, { method: 'DELETE' });
            tasks = tasks.filter(task => task.id !== parseInt(id)); // удаляем задачу из списка
            renderTasks(); // пересоздаём DOM с обновлённым списком
        }

        if (e.target.classList.contains('task-checkbox')) {
            const id = e.target.getAttribute('data-id');
            const completed = e.target.checked;

            // отправляем обновление на сервер
            await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed })
            });

            // обновляем статус задачи в списке
            const task = tasks.find(task => task.id === parseInt(id));
            task.completed = completed;
            renderTasks(); // пересоздаём DOM с обновлённым списком
        }
    });

    toggleHiddenCheckbox.addEventListener('change', renderTasks); // обновляем отображение задач при изменении состояния чекбокса

    await loadTasks();
});
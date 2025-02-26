

document.addEventListener('DOMContentLoaded', () => { // Ждём загрузки DOM
    const container = document.querySelector('#taskList');
    const taskTitleInput = document.querySelector('#taskTitle'); // Переименовали переменную
    const taskDescriptionInput = document.querySelector('#taskDescription');
    const button = document.querySelector('#taskAddButton');
  
    button.addEventListener('click', () => {
      if (!taskTitleInput.value || !taskDescriptionInput.value) return;
  
      const task = document.createElement('div');
      task.classList.add('card', 'mt-2');
      task.innerHTML = `
        <div class="card-header d-flex">
          <div class="card-title">
            <span>${taskTitleInput.value}</span>
          </div>
          <button type="button" class="close d-flex ml-auto">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="card-body">
          <span>${taskDescriptionInput.value}</span>
        </div>
      `;
  
      container.appendChild(task);
      taskTitleInput.value = '';
      taskDescriptionInput.value = '';
    });
  
    container.addEventListener('click', (e) => {
      if (e.target.closest('.close')) {
        e.target.closest('.card').remove();
      }
    });
  });
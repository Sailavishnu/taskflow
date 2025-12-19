
let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || [
    { id: '1', title: 'Example Task', desc: 'Drag me to another column!', tag: 'DEVELOPMENT', status: 'todo' }
];

let targetStatus = 'todo';

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(id);
    const dropTarget = ev.target.closest('.column');

    if (dropTarget) {
        const newStatus = dropTarget.id;
        const taskIndex = tasks.findIndex(t => t.id === id);
        tasks[taskIndex].status = newStatus;

        saveAndRender();
    }
    draggedElement.classList.remove('dragging');
}

function saveTask() {
    const title = document.getElementById('taskTitle').value;
    const desc = document.getElementById('taskDesc').value;
    const tag = document.getElementById('taskTag').value;

    if (!title) return;

    const newTask = {
        id: 'task-' + Date.now(),
        title,
        desc,
        tag,
        status: targetStatus
    };

    tasks.push(newTask);
    closeModal();
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    renderBoard();
}

function renderBoard() {
    const statuses = ['todo', 'inprogress', 'done'];

    statuses.forEach(status => {
        const list = document.getElementById(`list-${status}`);
        const count = document.getElementById(`count-${status}`);
        const filteredTasks = tasks.filter(t => t.status === status);

        count.innerText = filteredTasks.length;
        list.innerHTML = filteredTasks.map(t => `
                    <div class="task-card" draggable="true" ondragstart="drag(event)" id="${t.id}">
                        <div style="display:flex; justify-content:space-between">
                            <span class="task-tag">${t.tag}</span>
                            <i class="fas fa-trash" style="font-size:0.7rem; color:var(--text-muted); cursor:pointer" onclick="deleteTask('${t.id}')"></i>
                        </div>
                        <h3>${t.title}</h3>
                        <p>${t.desc}</p>
                    </div>
                `).join('');
    });
}

function openModal(status) {
    targetStatus = status;
    document.getElementById('taskModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
}

renderBoard();

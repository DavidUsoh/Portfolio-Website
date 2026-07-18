// ============================================================
// ACADEMIC PLANNER
// Demonstrates: arrays & functions, DOM manipulation, event
// handling, dynamic content updates, localStorage persistence.
// ============================================================

// The in-memory array holding every task object.
// Each task: { id, title, date, priority, done }
let tasks = [];
let currentFilter = 'all';

const STORAGE_KEY = 'academicPlannerTasks';

// ---- DOM references ----
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const statTotal = document.getElementById('statTotal');
const statDone = document.getElementById('statDone');
const statPending = document.getElementById('statPending');
const filterButtons = document.querySelectorAll('.filter-btn');

// ---- Persistence helpers ----
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Could not save tasks to localStorage:', e);
  }
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
  } catch (e) {
    tasks = [];
  }
}

// ---- Core functions ----
function addTask(title, date, priority) {
  const newTask = {
    id: Date.now(),          // simple unique id
    title: title.trim(),
    date: date || '',
    priority: priority,
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.done = !task.done;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === 'pending') {
    return tasks.filter(function (t) { return !t.done; });
  }
  if (currentFilter === 'done') {
    return tasks.filter(function (t) { return t.done; });
  }
  return tasks;
}

function formatDate(dateStr) {
  if (!dateStr) return 'No due date';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ---- Rendering (DOM manipulation) ----
function renderTasks() {
  const visibleTasks = getFilteredTasks();

  // Clear current list
  taskList.innerHTML = '';

  if (visibleTasks.length === 0) {
    emptyState.style.display = 'block';
    emptyState.textContent = tasks.length === 0
      ? 'No tasks yet — add your first one above.'
      : 'Nothing here for this filter.';
  } else {
    emptyState.style.display = 'none';

    visibleTasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');
      li.dataset.id = task.id;

      li.innerHTML =
        '<button class="task-checkbox" aria-label="Toggle complete"></button>' +
        '<div class="task-body">' +
          '<div class="task-title"></div>' +
          '<div class="task-meta">' +
            '<span>' + formatDate(task.date) + '</span>' +
            '<span class="badge ' + task.priority + '"></span>' +
          '</div>' +
        '</div>' +
        '<button class="task-delete" aria-label="Delete task">&times;</button>';

      // Set text content safely (avoids injecting raw HTML from user input)
      li.querySelector('.task-title').textContent = task.title;
      const badge = li.querySelector('.badge');
      badge.textContent = task.priority === 'high' ? 'High' : task.priority === 'med' ? 'Medium' : 'Low';

      // Event handling: complete + delete
      li.querySelector('.task-checkbox').addEventListener('click', function () {
        toggleTask(task.id);
      });
      li.querySelector('.task-delete').addEventListener('click', function () {
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });
  }

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(function (t) { return t.done; }).length;
  statTotal.textContent = total;
  statDone.textContent = done;
  statPending.textContent = total - done;
}

// ---- Event listeners ----
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!taskInput.value.trim()) return;
  addTask(taskInput.value, taskDate.value, taskPriority.value);
  taskForm.reset();
  taskInput.focus();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', function () {
  loadTasks();

  // Seed with example tasks the first time there's nothing saved,
  // so the planner isn't empty on first view.
  if (tasks.length === 0) {
    tasks = [
      { id: 1, title: 'Submit COS 106 term project', date: '', priority: 'high', done: false },
      { id: 2, title: 'Review CSC301 lecture notes', date: '', priority: 'med', done: false },
      { id: 3, title: 'Complete data analytics module 3', date: '', priority: 'low', done: true }
    ];
    saveTasks();
  }

  renderTasks();
});

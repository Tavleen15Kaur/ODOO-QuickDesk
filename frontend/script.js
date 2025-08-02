// Fetch and render tasks for the selected user
async function renderTasks() {
  const taskList = document.getElementById("taskList");
  const selectedUser = document.getElementById("user").value;
  taskList.innerHTML = "";

  try {
    const response = await fetch(`http://localhost:3000/api/tasks?user=${selectedUser}`);
    const tasks = await response.json();

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.done ? "completed" : "";

      li.innerHTML = `
        <div class="info">
          <strong>${task.text}</strong><br>
          Priority: ${task.priority} | Category: ${task.category}<br>
          Due: ${task.dueDate || "No due date"}
        </div>
        <div class="actions">
          <button onclick="toggle(${index})">${task.done ? "↩️ Undo" : "✅ Done"}</button>
          <button onclick="remove(${index})">❌ Delete</button>
        </div>
      `;

      taskList.appendChild(li);
    });

    updateDashboard(selectedUser, tasks);

  } catch (error) {
    alert('Error loading tasks: ' + error.message);
  }
}

// Add a new task by sending it to backend
async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;
  const user = document.getElementById("user").value;

  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task title.");

  const task = { user, text, priority, category, dueDate, done: false };

  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });

    if (!response.ok) throw new Error('Failed to save task');

    taskInput.value = "";
    taskInput.focus();
    renderTasks();
  } catch (error) {
    alert('Error saving task: ' + error.message);
  }
}

// Toggle task done status on backend
async function toggle(index) {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${index}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to toggle task');
    renderTasks();
  } catch (error) {
    alert(error.message);
  }
}

// Delete task on backend
async function remove(index) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${index}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    renderTasks();
  } catch (error) {
    alert(error.message);
  }
}

// Update the dashboard stats for current user and tasks list
function updateDashboard(user, tasks) {
  document.getElementById("dashUser").textContent = user;

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending = total - completed;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("completedTasks").textContent = completed;
}

// When user selection changes, reload tasks
document.getElementById("user").addEventListener("change", renderTasks);

renderTasks();

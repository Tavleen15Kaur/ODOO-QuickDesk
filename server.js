const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/api/tasks', (req, res) => {
  const user = req.query.user;
  if (user) {
    const filtered = tasks.filter(task => task.user === user);
    res.json(filtered);
  } else {
    res.json(tasks);
  }
});

app.post('/api/tasks', (req, res) => {
  const task = req.body;
  if (!task || !task.user || !task.text) {
    return res.status(400).json({ error: 'Invalid task data' });
  }
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks[index].done = !tasks[index].done;
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

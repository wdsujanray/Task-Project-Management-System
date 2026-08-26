const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let projects = [
  {
    _id: 'p1',
    name: 'Website Redesign',
    description: 'Refresh the landing pages and user dashboard experience.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p2',
    name: 'Mobile App Launch',
    description: 'Prepare the release plan for the Android and iOS app.',
    status: 'On Hold',
    createdAt: new Date().toISOString(),
  },
];

let tasks = [
  {
    _id: 't1',
    title: 'Collect design assets',
    description: 'Gather all icons, illustrations, and brand files.',
    completed: false,
    priority: 'High',
    dueDate: '2026-08-15',
    projectId: 'p1',
  },
  {
    _id: 't2',
    title: 'Finalize sprint plan',
    description: 'Define deliverables for the next sprint cycle.',
    completed: true,
    priority: 'Medium',
    dueDate: '2026-08-18',
    projectId: 'p2',
  },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task & Project Management System API is running' });
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/projects', (req, res) => {
  const { name, description, status } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const newProject = {
    _id: `p${Date.now()}`,
    name: name.trim(),
    description: description || '',
    status: status || 'Active',
    createdAt: new Date().toISOString(),
  };

  projects.unshift(newProject);
  res.status(201).json(newProject);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, projectId, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const newTask = {
    _id: `t${Date.now()}`,
    title: title.trim(),
    description: description || '',
    completed: false,
    priority: priority || 'Medium',
    dueDate: dueDate || '',
    projectId: projectId || (projects[0] ? projects[0]._id : ''),
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed, title, description, priority, dueDate } = req.body;

  const taskIndex = tasks.findIndex((task) => task._id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...(typeof completed === 'boolean' ? { completed } : {}),
    ...(title ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(priority ? { priority } : {}),
    ...(dueDate !== undefined ? { dueDate } : {}),
  };

  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const originalCount = tasks.length;
  tasks = tasks.filter((task) => task._id !== id);

  if (tasks.length === originalCount) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully' });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const originalCount = projects.length;
  projects = projects.filter((project) => project._id !== id);
  tasks = tasks.filter((task) => task.projectId !== id);

  if (projects.length === originalCount) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ message: 'Project deleted successfully' });
});

module.exports = app;

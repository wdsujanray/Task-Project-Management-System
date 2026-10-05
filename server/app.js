const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { connectDatabase, getDatabase } = require('./src/db');
const { createToken, getUserIdFromToken, hashPassword, publicUser, verifyPassword } = require('./src/auth');
const requestLogger = require('./middleware/requestLogger');
const projectRoutes = require('./routes/projectRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/test', testRoutes);
app.use('/api/projects', projectRoutes);

function requireUser(req, res, next) {
  try {
    const userId = getUserIdFromToken(req.headers.authorization?.replace('Bearer ', ''));
    if (!userId || !ObjectId.isValid(userId)) return res.status(401).json({ message: 'Authentication required' });
    req.userId = new ObjectId(userId);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
}

app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/api/test') return next();
  try {
    await connectDatabase();
    next();
  } catch (error) {
    res.status(503).json({ message: 'MongoDB is unavailable', detail: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task & Project Management System API is running' });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

  try {
    const users = getDatabase().collection('users');
    const user = { name: name.trim(), email: email.trim().toLowerCase(), password: hashPassword(password), role: 'Project Manager', createdAt: new Date() };
    const result = await users.insertOne(user);
    user._id = result.insertedId;
    res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
    res.status(500).json({ message: 'Unable to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getDatabase().collection('users').findOne({ email: email?.trim().toLowerCase() });
  if (!user || !verifyPassword(password || '', user.password)) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
});

app.get('/api/auth/profile', requireUser, async (req, res) => {
  const user = await getDatabase().collection('users').findOne({ _id: req.userId });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(publicUser(user));
});

app.get('/api/projects', requireUser, async (req, res) => {
  const projects = await getDatabase().collection('projects').find({ ownerId: req.userId }).sort({ createdAt: -1 }).toArray();
  res.json(projects.map((project) => ({ ...project, name: project.name || project.title })));
});

app.get('/api/tasks', requireUser, async (req, res) => {
  const tasks = await getDatabase().collection('tasks').find({ assignedTo: req.userId }).sort({ createdAt: -1 }).toArray();
  res.json(tasks.map((task) => ({ ...task, completed: task.completed ?? task.status === 'completed' })));
});

app.post('/api/projects', requireUser, async (req, res) => {
  const { name, title, description, category, startDate, completionDate, attachment, status } = req.body;
  const projectName = (name || title || '').trim();

  if (!projectName) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  const newProject = { title: projectName, description: description || '', category: category || 'General', startDate: startDate || '', completionDate: completionDate || '', attachment: attachment || '', status: status || 'Planning', ownerId: req.userId, createdAt: new Date() };
  const result = await getDatabase().collection('projects').insertOne(newProject);
  newProject._id = result.insertedId;
  res.status(201).json({ ...newProject, name: newProject.title });
});

app.post('/api/tasks', requireUser, async (req, res) => {
  const { title, name, description, category, startDate, completionDate, attachment, projectId, priority, dueDate } = req.body;
  const taskTitle = (title || name || '').trim();

  if (!taskTitle) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const newTask = {
    title: taskTitle,
    description: description || '',
    category: category || 'General',
    startDate: startDate || '',
    completionDate: completionDate || dueDate || '',
    attachment: attachment || '',
    completed: false,
    priority: priority || 'Medium',
    dueDate: dueDate || '',
    projectId: projectId || '',
    assignedTo: req.userId,
    createdAt: new Date(),
  };

  const result = await getDatabase().collection('tasks').insertOne(newTask);
  newTask._id = result.insertedId;
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const { completed, title, description, category, startDate, completionDate, priority, dueDate } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updates = { ...(typeof completed === 'boolean' ? { completed } : {}), ...(title ? { title } : {}), ...(description !== undefined ? { description } : {}), ...(category ? { category } : {}), ...(startDate !== undefined ? { startDate } : {}), ...(completionDate !== undefined ? { completionDate, dueDate: completionDate } : dueDate !== undefined ? { dueDate, completionDate: dueDate } : {}), ...(priority ? { priority } : {}) };
  const result = await getDatabase().collection('tasks').findOneAndUpdate({ _id: new ObjectId(id), assignedTo: req.userId }, { $set: updates }, { returnDocument: 'after' });
  if (!result) return res.status(404).json({ message: 'Task not found' });
  res.json(result);
});

app.patch('/api/projects/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const { name, description, category, startDate, completionDate, status } = req.body;
  if (!ObjectId.isValid(id)) return res.status(404).json({ message: 'Project not found' });

  const updates = { ...(name ? { title: name.trim() } : {}), ...(description !== undefined ? { description } : {}), ...(category ? { category } : {}), ...(startDate !== undefined ? { startDate } : {}), ...(completionDate !== undefined ? { completionDate } : {}), ...(status ? { status } : {}) };
  const result = await getDatabase().collection('projects').findOneAndUpdate({ _id: new ObjectId(id), ownerId: req.userId }, { $set: updates }, { returnDocument: 'after' });
  if (!result) return res.status(404).json({ message: 'Project not found' });
  res.json({ ...result, name: result.name || result.title });
});

app.delete('/api/tasks/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const result = await getDatabase().collection('tasks').deleteOne({ _id: new ObjectId(id), assignedTo: req.userId });
  if (!result.deletedCount) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully' });
});

app.delete('/api/projects/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  const projectId = new ObjectId(id);
  const result = await getDatabase().collection('projects').deleteOne({ _id: projectId, ownerId: req.userId });
  await getDatabase().collection('tasks').deleteMany({ projectId: projectId, assignedTo: req.userId });
  if (!result.deletedCount) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ message: 'Project deleted successfully' });
});

module.exports = app;

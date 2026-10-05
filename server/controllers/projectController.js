const mongoose = require('mongoose');
const Project = require('../models/Project');

function isValidId(id) {
  return mongoose.isObjectIdOrHexString(id);
}

function serializeProject(project) {
  const data = typeof project.toObject === 'function' ? project.toObject() : project;
  const formattedDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : null);

  return {
    ...data,
    _id: data._id.toString(),
    name: data.name || data.title,
    title: data.title || data.name,
    startDate: formattedDate(data.startDate),
    endDate: formattedDate(data.endDate),
    completionDate: formattedDate(data.endDate),
  };
}

function projectFields(body, { partial = false } = {}) {
  const fields = {};
  const name = body.name ?? body.title;

  if (name !== undefined) {
    fields.name = name;
    fields.title = name;
  } else if (!partial) {
    fields.name = '';
  }

  for (const field of ['description', 'status', 'category', 'attachment']) {
    if (body[field] !== undefined) {
      fields[field] = body[field];
    }
  }

  if (body.startDate !== undefined) {
    fields.startDate = body.startDate || null;
  }
  const endDate = body.endDate ?? body.completionDate;
  if (endDate !== undefined) {
    fields.endDate = endDate || null;
  }

  return fields;
}

function isProjectPayload(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function handleProjectError(res, error) {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'MongoDB is unavailable' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Unable to complete the project request' });
}

async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    res.json(projects.map(serializeProject));
  } catch (error) {
    handleProjectError(res, error);
  }
}

async function getProjectById(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(serializeProject(project));
  } catch (error) {
    handleProjectError(res, error);
  }
}

async function createProject(req, res) {
  if (!isProjectPayload(req.body)) {
    return res.status(400).json({ message: 'Request body must be a JSON object' });
  }

  try {
    const project = await Project.create(projectFields(req.body));
    res.status(201).json(serializeProject(project));
  } catch (error) {
    handleProjectError(res, error);
  }
}

async function updateProject(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }
  if (!isProjectPayload(req.body)) {
    return res.status(400).json({ message: 'Request body must be a JSON object' });
  }

  const updates = projectFields(req.body, { partial: true });
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'At least one project field is required' });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(serializeProject(project));
  } catch (error) {
    handleProjectError(res, error);
  }
}

async function deleteProject(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    handleProjectError(res, error);
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

function getProjects(req, res) {
  res.json([]);
}

function getProjectById(req, res) {
  res.json({
    _id: req.params.id,
    message: 'Project retrieved successfully',
  });
}

function createProject(req, res) {
  const project = {
    ...req.body,
    _id: `temporary-${Date.now()}`,
  };

  res.status(201).json(project);
}

function updateProject(req, res) {
  res.json({
    ...req.body,
    _id: req.params.id,
    message: 'Project updated successfully',
  });
}

function deleteProject(req, res) {
  res.json({
    success: true,
    message: `Project ${req.params.id} deleted successfully`,
  });
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

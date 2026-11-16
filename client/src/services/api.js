const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  } catch {
    throw new Error(`Cannot connect to the API at ${API_URL}. Start the server on port 5000.`);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function requestPasswordReset(email) {
  return request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPassword(token, password) {
  return request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
}

export function getProfile(token) {
  return request("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
}

export function updateProfile(token, updates) {
  return request("/auth/profile", { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) });
}

export function deleteAccount(token, currentPassword) {
  return request("/auth/account", { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword }) });
}

export function updateOrganization(token, organization) {
  return updateProfile(token, { organization });
}

export function seedDemoWorkspace(token) {
  return request("/demo/seed", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
}

export function getTeams(token) {
  return request("/teams", { headers: { Authorization: `Bearer ${token}` } });
}

export function createTeam(token, team) {
  return request("/teams", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(team) });
}

export function updateTeam(token, teamId, updates) {
  return request(`/teams/${teamId}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) });
}

export function deleteTeam(token, teamId) {
  return request(`/teams/${teamId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export function getProjects(token) {
  return request("/projects", { headers: { Authorization: `Bearer ${token}` } });
}

export function getTasks(token, projectId) {
  const query = projectId ? `?project=${encodeURIComponent(projectId)}` : "";
  return request(`/tasks${query}`, { headers: { Authorization: `Bearer ${token}` } });
}

export function createProject(token, project) {
  return request("/projects", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(project) });
}

export function createTask(token, task) {
  return request("/tasks", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(task) });
}

export function updateProject(token, projectId, updates) {
  return request(`/projects/${projectId}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) });
}

export function updateTask(token, taskId, updates) {
  return request(`/tasks/${taskId}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) });
}

export function deleteProject(token, projectId) {
  return request(`/projects/${projectId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export function deleteTask(token, taskId) {
  return request(`/tasks/${taskId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export function getRecycleBinItems(token) {
  return request("/recycle-bin", { headers: { Authorization: `Bearer ${token}` } });
}

export function restoreRecycleBinItem(token, itemId) {
  return request(`/recycle-bin/${encodeURIComponent(itemId)}/restore`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function permanentlyDeleteRecycleBinItem(token, itemId) {
  return request(`/recycle-bin/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

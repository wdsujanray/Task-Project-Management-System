const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
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

export function registerUser(user) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(user) });
}

export function loginUser(credentials) {
  return request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
}

export function getProfile(token) {
  return request("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
}

export function getProjects(token) {
  return request("/projects", { headers: { Authorization: `Bearer ${token}` } });
}

export function getTasks(token) {
  return request("/tasks", { headers: { Authorization: `Bearer ${token}` } });
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

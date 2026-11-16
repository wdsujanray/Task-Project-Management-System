import { request } from "./api";

export function getProjects(token) {
  return request("/projects", { headers: { Authorization: `Bearer ${token}` } });
}

export function getProject(token, projectId) {
  return request(`/projects/${encodeURIComponent(projectId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createProject(token, project) {
  return request("/projects", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(project),
  });
}

export function updateProject(token, projectId, updates) {
  return request(`/projects/${encodeURIComponent(projectId)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

export function deleteProject(token, projectId) {
  return request(`/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

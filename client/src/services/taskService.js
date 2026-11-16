import { request } from "./api";

export function getTasks(token) {
  return request("/tasks", { headers: { Authorization: `Bearer ${token}` } });
}

export function getTask(token, taskId) {
  return request(`/tasks/${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createTask(token, task) {
  return request("/tasks", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
}

export function updateTask(token, taskId, updates) {
  return request(`/tasks/${encodeURIComponent(taskId)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

export function deleteTask(token, taskId) {
  return request(`/tasks/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
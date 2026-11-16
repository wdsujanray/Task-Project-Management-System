import { request } from "./api";

export function registerUser(user) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

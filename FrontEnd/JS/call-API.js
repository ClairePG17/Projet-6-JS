import { API_BASE_URL } from "./login.js";

export async function authenticateUser(credentials) {
  const url = `${API_BASE_URL}/users/login`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  };

  return fetchData(url, options);
}

export async function fetchData(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Authentication error");
    }
    throw new Error(`HTTP error: ${response.status}`);
  }

  if (response.status === 204) return {};

  return response.json();
}

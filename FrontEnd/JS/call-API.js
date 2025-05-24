// JS/call-API.js

import { API_BASE_URL } from './login.js';

export async function authenticateUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Authentication error");
  return response.json();
} 

export async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
} 

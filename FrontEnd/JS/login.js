import { form, errorMsg, handleLoginError } from "./utility-fonctions.js";
import { fetchData } from "./call-api.js";

export const API_BASE_URL = "http://localhost:5678/api";
export const AUTH_TOKEN_KEY = "authToken";

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const credentials = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  const url = `${API_BASE_URL}/users/login`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  };

  try {
    const { token } = await fetchData(url, options);
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    window.location.href = "index.html";
  } catch (error) {
    handleLoginError(error, errorMsg);
  }
});

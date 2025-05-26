import { form, errorMsg, handleLoginError } from "./utility-fonctions.js";
import { authenticateUser } from "./call-API.js";

export const API_BASE_URL = "http://localhost:5678/api";
export const AUTH_TOKEN_KEY = "authToken";

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const { token } = await authenticateUser({
        email: form.email.value.trim(),
        password: form.password.value,
      });

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      window.location.href = "administrateur.html";
      
    } catch (error) {
      handleLoginError(error, errorMsg);
    }
  });


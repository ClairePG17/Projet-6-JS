export const API_BASE_URL = "http://localhost:5678/api";
export const AUTH_TOKEN_KEY = "authToken";
export const form = document.querySelector(".login-container form");
export let errorMsg = null;

if (form) {
  errorMsg = createErrorMessage(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = "";

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
}
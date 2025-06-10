import { form, errorMsg, handleLoginError } from "./utility-fonctions.js";
import { fetchData } from "./call-api.js";

export const API_BASE_URL = "http://localhost:5678/api";
export const AUTH_TOKEN_KEY = "authToken";

//.1 Submitting login form
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
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.location.href = "index.html";
  } catch (error) {
    handleLoginError(error, errorMsg);
  }
});

//2. Login <-> Logout
export function displayAdmin() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const portfolioHeader = document.querySelector(".portfolio__header");
  const filters = document.querySelector(".filters");
  const navList = document.querySelector("header nav ul");
  const loginLogoutLi = navList.querySelector(".login-logout");

  if (token) {
    loginLogoutLi.innerHTML = `<a href="#" id="logout-link">logout</a>`;
    const logoutLink = document.getElementById("logout-link");
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.reload();
    });
  } else {
    loginLogoutLi.innerHTML = `<a href="login.html">login</a>`;
  }

  // Display Admin <-> client
  if (token) {
    const editionHeader = document.createElement("div");
    editionHeader.className = "edition-mode";
    editionHeader.innerHTML = `
        <img src="assets/icons/edition-mode.svg" alt="mode edition" />
        <p>Mode édition</p>
      `;
    document.body.insertBefore(editionHeader, document.body.firstChild);

    const modifier = document.createElement("div");
    modifier.className = "portfolio__edition";
    modifier.innerHTML = `
        <img src="assets/icons/edition-mode_black.svg" alt="mode edition" />
        <a class="js-modal" href="#modal">Modifier</a>
      `;
    portfolioHeader.appendChild(modifier);

    filters.style.display = "none";
    portfolioHeader.classList.add("edition");
  } else {
    const editionHeader = document.querySelector(".edition-mode");
    editionHeader.remove();

    const modifier = portfolioHeader.querySelector(".portfolio__edition");
    modifier.remove();

    filters.style.display = "flex";
    portfolioHeader.classList.remove("edition");
  }
}

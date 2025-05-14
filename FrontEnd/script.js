const API_BASE_URL = "http://localhost:5678/api";
const AUTH_TOKEN_KEY = "authToken";

const gallery = document.querySelector(".gallery");
const portfolioSection = document.getElementById("portfolio");
const portfolioTitle = portfolioSection?.querySelector("h2");

// 1. Login management 
if (document.querySelector(".login-container")) {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-container form");
    const errorMsg = createErrorMessage(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorMsg.textContent = "";

      try {
        // Try to authenticate the user
        const { token } = await authenticateUser({
          email: form.email.value.trim(),
          password: form.password.value
        });

        // Store the token in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        // Redirect to homepage
        window.location.href = "index.html";
      } catch (error) {
        // Handle login error
        handleLoginError(error, errorMsg);
      }
    });
  });
}

// 2. Gallery management (for index.html)
if (gallery && portfolioSection) {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Fetch works and categories in parallel
      const [works, categories] = await Promise.all([
        fetchData(`${API_BASE_URL}/works`),
        fetchData(`${API_BASE_URL}/categories`)
      ]);

      // Render works and filter buttons
      renderWorks(works);
      renderFilterButtons(categories);
      setupFilters();
    } catch (error) {
      // Handle fetch error
      handleFetchError(error);
    }
  });
}

// Utility functions

// Authenticate user and return token
async function authenticateUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) throw new Error("Authentication error");
  return response.json();
}

// Fetch data from API and return JSON
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

// Create and append an error message element to the parent
function createErrorMessage(parent) {
  const errorMsg = document.createElement("div");
  errorMsg.className = "error-message";
  errorMsg.style.cssText = "color: red; margin-top: 10px;";
  parent.appendChild(errorMsg);
  return errorMsg;
}

// Render works in the gallery
function renderWorks(works) {
  gallery.innerHTML = works.map(work => `
    <figure data-category-id="${work.categoryId}">
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>
  `).join("");
}

// Render filter buttons below the portfolio title
function renderFilterButtons(categories) {
  const filtersContainer = document.createElement("div");
  filtersContainer.className = "filters";
  
  const buttons = [
    createFilterButton("Tous", "all", true),
    ...categories.map(cat => createFilterButton(cat.name, cat.id))
  ];

  buttons.forEach(btn => filtersContainer.appendChild(btn));
  portfolioTitle.after(filtersContainer);
}

// Create a filter button element
function createFilterButton(text, categoryId, isActive = false) {
  const button = document.createElement("button");
  button.className = `filter-btn ${isActive ? "active" : ""}`;
  button.textContent = text;
  button.dataset.categoryId = categoryId;
  return button;
}

// Set up event listeners for filter buttons
function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(btn => 
        btn.classList.remove("active"));
      
      button.classList.add("active");
      filterWorks(button.dataset.categoryId);
    });
  });
}

// Filter works in the gallery by category
function filterWorks(categoryId) {
  document.querySelectorAll(".gallery figure").forEach(figure => {
    figure.style.display = 
      categoryId === "all" || figure.dataset.categoryId === categoryId 
        ? "block" 
        : "none";
  });
}

// Handle login errors and display messages
function handleLoginError(error, errorMsg) {
  errorMsg.textContent = error.message.includes("Authentication") 
    ? "Identifiants incorrects" 
    : "Erreur de connexion";
  console.error(error);
}

// Handle fetch errors and display messages
function handleFetchError(error) {
  gallery.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
  console.error("Fetch error:", error);
}

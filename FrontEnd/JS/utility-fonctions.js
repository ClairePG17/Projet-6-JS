// Create and append an error message element to the parent
function createErrorMessage(parent) {
  const errorMsg = document.createElement("div");
  errorMsg.className = "error-message";
  parent.appendChild(errorMsg);
  return errorMsg;
}

// Render filter buttons below the portfolio title
function renderFilterButtons(categories) {
  const filtersContainer = document.createElement("div");

  filtersContainer.className = "filters";

  const buttons = [
    createFilterButton("Tous", "all", true),
    ...categories.map((cat) => createFilterButton(cat.name, cat.id)),
  ];

  buttons.forEach((btn) => filtersContainer.appendChild(btn));

  portfolioTitle.after(filtersContainer);

  if (window.location.pathname.endsWith("administrateur.html")) {
    filtersContainer.style.display = "none";
  }
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
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");
      filterWorks(button.dataset.categoryId);
    });
  });
}

// Filter works in the gallery by category
function filterWorks(categoryId) {
  document.querySelectorAll(".gallery figure").forEach((figure) => {
    figure.style.display =
      categoryId === "all" || figure.dataset.categoryId === categoryId ? "block" : "none";
  });
}

// Handle login errors and display messages
export function handleLoginError(error, errorMsg) {
  errorMsg.textContent = error.message.includes("Authentication")
    ? "Erreur dans l’identifiant ou le mot de passe"
    : "Erreur de connexion";
}

// Handle fetch errors and display messages
export function handleFetchError(error) {
  gallery.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
}

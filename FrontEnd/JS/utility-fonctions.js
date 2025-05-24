// JS/utility-fonctions.js

export function createErrorMessage(parent) {
  const errorMsg = document.createElement("div");
  errorMsg.className = "error-message";
  parent.appendChild(errorMsg);
  return errorMsg;
}

export function renderWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = works
    .map(
      (work) => `<figure data-id="${work.id}" data-category-id="${work.categoryId}">
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    </figure>`
    )
    .join("");
}

export function renderFilterButtons(categories) {
  const portfolioTitle = document.getElementById("portfolio")?.querySelector("h2");
  if (!portfolioTitle) return;
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

function createFilterButton(text, categoryId, isActive = false) {
  const button = document.createElement("button");
  button.className = `filter-btn ${isActive ? "active" : ""}`;
  button.textContent = text;
  button.dataset.categoryId = categoryId;
  return button;
}

export function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterWorks(button.dataset.categoryId);
    });
  });
}

function filterWorks(categoryId) {
  document.querySelectorAll(".gallery figure").forEach((figure) => {
    figure.style.display =
      categoryId === "all" || figure.dataset.categoryId === categoryId ? "block" : "none";
  });
}

export function handleLoginError(error, errorMsg) {
  errorMsg.textContent = error.message.includes("Authentication")
    ? "Erreur dans l’identifiant ou le mot de passe"
    : "Erreur de connexion";
}

export function handleFetchError(error) {
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    gallery.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
  }
}

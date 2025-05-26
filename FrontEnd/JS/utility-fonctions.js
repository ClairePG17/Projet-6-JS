export const form = document.querySelector(".login-container form");
export const errorMsg = form ? form.querySelector(".error-message") : null;

// 1. Creation Gallery
export function renderWorks(works) {
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = works
    .map(
      (work) => `
        <figure class="category-${work.categoryId}">
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        </figure>
      `
    )
    .join("");
}

// 2. Creation Filter
export function renderFilterButtons(categories) {
  const filtersContainer = document.querySelector(".filters");

  // Table to link button <-> category
  const btnCategories = [];

  function createFilterButton(text, isActive = false) {
    const button = document.createElement("button");
    button.className = `filter-btn${isActive ? " active" : ""}`;
    button.textContent = text;

    return button;
  }

  // Filling the btnCategories table, (btn all is the one active by default)
  const btnTous = createFilterButton("Tous", true);
  filtersContainer.appendChild(btnTous);
  btnCategories.push({ button: btnTous, categoryId: "all" });

  categories.forEach((cat) => {
    const btn = createFilterButton(cat.name);
    filtersContainer.appendChild(btn);
    btnCategories.push({ button: btn, categoryId: cat.id });
  });

  btnCategories.forEach(({ button, categoryId }) => {
    button.addEventListener("click", () => {
      btnCategories.forEach(({ button }) => button.classList.remove("active"));
      button.classList.add("active");

      filterWorks(categoryId);
    });
  });
}

function filterWorks(categoryId) {
  document.querySelectorAll(".gallery figure").forEach((figure) => {
    if (categoryId === "all" || figure.classList.contains(`category-${categoryId}`)) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

// 3. Errors management
export function handleLoginError(error, errorMsg) {
  errorMsg.textContent = error.message.includes("Authentication")
    ? "Erreur dans l’identifiant ou le mot de passe"
    : "Erreur de connexion";
}

export function handleFetchError(error) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = `<p>Erreur de chargement : ${error.message}</p>`;
}

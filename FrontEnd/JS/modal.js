import { worksData } from "./gallery.js";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "./login.js";
import { renderWorks } from "./utility-fonctions.js";
import { fetchData } from "./call-api.js";

let modal = null;
let modal1, modal2, imageInput, imagePreview, chooseImageBtn, photoInfo, addWorkForm;

//1. Intern functions
const openModal = function (e) {
  e.preventDefault();

  modal = document.getElementById("modal");

  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  modal.querySelector(".js-stop-propagation").addEventListener("click", (e) => e.stopPropagation());

  modal1.style.display = "";
  modal2.style.display = "none";

  updateModalGallery();
};

const closeModal = function (e) {
  e.preventDefault();

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal", "false");

  modal.removeEventListener("click", closeModal);
  modal.querySelectorAll(".close-btn").forEach((btn) => {
    btn.removeEventListener("click", closeModal);
  });
  modal
    .querySelector(".js-stop-propagation")
    .removeEventListener("click", (e) => e.stopPropagation());

  //Reinitialize add form when modal is closed while the user is on modal2
  if (modal2.style.display !== "none") {
    addWorkForm.reset();
    imagePreview.src = "assets/icons/photo.png";
    imagePreview.classList.remove("is-uploaded");
    updatePhotoControlsVisibility();
  }

  modal = null;
};

//Modal1 : Delete work option
function renderImagesInModal() {
  const modalGallery = document.querySelector(".modal-gallery");

  modalGallery.innerHTML = worksData
    .map(
      (work) => `
        <figure data-id="${work.id}">
          <img src="${work.imageUrl}" alt="${work.title}" class="modal-img" />
          <img src="assets/icons/delete-work.svg" alt="Supprimer" class="delete-btn" />
        </figure>
      `
    )
    .join("");
}

function addDeleteListeners() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const figure = e.target.closest("figure");
      const workId = figure.getAttribute("data-id");

      try {
        const url = `${API_BASE_URL}/works/${workId}`;
        const options = {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem(AUTH_TOKEN_KEY),
            Accept: "application/json",
          },
        };

        await fetchData(url, options);

        figure.remove();
        const index = worksData.findIndex((work) => work.id == workId);
        if (index !== -1) worksData.splice(index, 1);

        renderWorks(worksData);
      } catch (err) {
        alert("Erreur lors de la suppression ou réseau");
      }
    });
  });
}

function updateModalGallery() {
  renderImagesInModal();
  addDeleteListeners();
}

//Modal2 : form to add a work to the gallery
async function populateCategoryDropdown() {
  try {
    const url = `${API_BASE_URL}/categories`;

    const categories = await fetchData(url);

    const select = document.getElementById("cat");

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    select.appendChild(defaultOption);

    // Use of Set to avoid duplication
    const ids = new Set();

    categories.forEach((cat) => {
      if (!ids.has(cat.id)) {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
        ids.add(cat.id);
      }
    });
  } catch (err) {
    alert("Erreur lors du chargement des catégories");
  }
}

// Function to show/hide button and paragraph
function updatePhotoControlsVisibility() {
  if (imageInput.files.length > 0) {
    chooseImageBtn.style.display = "none";
    photoInfo.style.display = "none";
  } else {
    chooseImageBtn.style.display = "";
    photoInfo.style.display = "";
  }
}

// 2. Export functions

export function setupModals() {
  // Retrieves DOM elements
  modal1 = document.getElementById("modal1");
  modal2 = document.getElementById("modal2");
  imageInput = document.getElementById("image-input");
  imagePreview = document.getElementById("image-preview");
  chooseImageBtn = document.getElementById("choose-image-btn");
  photoInfo = document.getElementById("photo-info");
  addWorkForm = document.getElementById("add-work-form");

  // Event to open modal2
  const btnAdd = document.querySelector(".btn-add");

  btnAdd.addEventListener("click", function (e) {
    e.preventDefault();
    modal1.style.display = "none";
    modal2.style.display = "";
    populateCategoryDropdown();
  });

  // Event to go back to modal1 from modal2
  const backBtn = document.querySelector(".back-btn");

  backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal2.style.display = "none";
    modal1.style.display = "";

    addWorkForm.reset();
    imagePreview.src = "assets/icons/photo.png";
    imagePreview.classList.remove("is-uploaded");
    updatePhotoControlsVisibility();
  });

  // Event to open modal
  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  // Closing modals vie keyboard
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
  });

  // Uploaded image management
  chooseImageBtn.addEventListener("click", function (e) {
    e.preventDefault();
    imageInput.click();
  });

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add("is-uploaded");
        updatePhotoControlsVisibility();
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "assets/icons/photo.png";
      imagePreview.classList.remove("is-uploaded");
      updatePhotoControlsVisibility();
    }
  });

  // Submitting a project to add it
  addWorkForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("titre").value.trim();
    const category = document.getElementById("cat").value;
    const imageFile = imageInput.files[0];

    if (!title || !category || !imageFile) {
      alert("Veuillez remplir tous les champs et choisir une image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", imageFile);

    try {
      const url = `${API_BASE_URL}/works`;
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(AUTH_TOKEN_KEY),
        },
        body: formData,
      };

      const newWork = await fetchData(url, options);
      worksData.push(newWork);
      renderWorks(worksData);
      updateModalGallery();
      addWorkForm.reset();
      imagePreview.src = "assets/icons/photo.png";
    } catch (err) {
      if (err.message.includes("401")) {
        alert("Non autorisé. Veuillez vous reconnecter.");
      } else {
        alert("Erreur lors de l'ajout du projet ou réseau.");
      }
    }

    // Reset add form (img + cat dropdown + layout)
    addWorkForm.addEventListener("reset", function () {
      imagePreview.src = "assets/icons/photo.png";
      imagePreview.classList.remove("is-uploaded");
      imageInput.value = "";

      const select = document.getElementById("cat");
      select.selectedIndex = 0;

      updatePhotoControlsVisibility();
    });
  });
}

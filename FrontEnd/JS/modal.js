// JS/modal.js

import { worksData } from './gallery.js';
import { API_BASE_URL, AUTH_TOKEN_KEY } from './login.js';
import { renderWorks } from './utility-fonctions.js';

// Variables globales pour la modale
let modal = null;
let modal1, modal2, imageInput, imagePreview, chooseImageBtn, photoInfo, addWorkForm;

// ----------- Fonctions internes -----------

function renderImagesInModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  if (!modalGallery) return;
  modalGallery.innerHTML = worksData
    .map(
      (work) => `
        <figure data-category-id="${work.categoryId}" data-id="${work.id}" style="position: relative;">
          <img src="${work.imageUrl}" alt="${work.title}" class="modal-img" />
          <img src="assets/icons/delete-work.svg" alt="Supprimer" class="delete-btn" />
        </figure>
      `
    )
    .join("");
}

function addDeleteListeners() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async function (e) {
      e.stopPropagation();
      const figure = e.target.closest('figure');
      const workId = figure.getAttribute('data-id');
      try {
        const response = await fetch(`${API_BASE_URL}/works/${workId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem(AUTH_TOKEN_KEY),
            'Accept': 'application/json',
          }
        });
        if (response.ok) {
          figure.remove();
          // Met à jour worksData localement
          const index = worksData.findIndex(work => work.id == workId);
          if (index !== -1) worksData.splice(index, 1);
          renderWorks(worksData);
        } else {
          alert('Erreur lors de la suppression.');
        }
      } catch (err) {
        alert('Erreur réseau');
      }
    });
  });
}

function updateModalGallery() {
  renderImagesInModal();
  addDeleteListeners();
}

const openModal = function (e) {
  e.preventDefault();

  modal = document.querySelector(e.target.getAttribute("href"));
  if (!modal) return;
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);

  modal.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  modal.querySelector(".js-stop-propagation").addEventListener("click", stopPropagation);

  modal1.style.display = "";
  modal2.style.display = "none";

  updateModalGallery();
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);

  modal.querySelectorAll(".close-btn").forEach((btn) => {
    btn.removeEventListener("click", closeModal);
  });

  modal.querySelector(".js-stop-propagation").removeEventListener("click", stopPropagation);

  if (modal2.style.display !== "none" && addWorkForm) {
    addWorkForm.reset();
    imagePreview.src = "assets/icons/photo.png";
    imagePreview.classList.remove('is-uploaded');
    updatePhotoControlsVisibility();
  }

  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

async function populateCategoryDropdown() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Erreur lors du chargement des catégories');
    const categories = await response.json();
    const select = document.getElementById('cat');
    if (!select) return;

    // Vide d'abord le select pour éviter les doublons
    select.innerHTML = '';
    // Ajoute l'option vide par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Ajoute les catégories sans doublons
    const ids = new Set();
    categories.forEach(cat => {
      if (!ids.has(cat.id)) {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
        ids.add(cat.id);
      }
    });
  } catch (err) {
    alert('Erreur lors du chargement des catégories');
  }
}

// Fonction pour afficher/masquer le bouton et le paragraphe
function updatePhotoControlsVisibility() {
  if (imageInput && chooseImageBtn && photoInfo) {
    if (imageInput.files.length > 0) {
      chooseImageBtn.style.display = "none";
      photoInfo.style.display = "none";
    } else {
      chooseImageBtn.style.display = "";
      photoInfo.style.display = "";
    }
  }
}

// ----------- Fonction d'initialisation à exporter -----------

export function setupModals() {
  // Récupère les éléments du DOM
  modal1 = document.getElementById("modal1");
  modal2 = document.getElementById("modal2");
  imageInput = document.getElementById('image-input');
  imagePreview = document.getElementById('image-preview');
  chooseImageBtn = document.getElementById('choose-image-btn');
  photoInfo = document.getElementById('photo-info');
  addWorkForm = document.getElementById('add-work-form');

  // Event pour ouvrir la modale d'ajout
  const btnAdd = document.querySelector(".btn-add");
  if (btnAdd) {
    btnAdd.addEventListener("click", function (e) {
      e.preventDefault();
      modal1.style.display = "none";
      modal2.style.display = "";
      populateCategoryDropdown();
    });
  }

  // Event pour retour à la première modale
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal2.style.display = "none";
      modal1.style.display = "";

      if (addWorkForm) {
        addWorkForm.reset();
        imagePreview.src = "assets/icons/photo.png";
        imagePreview.classList.remove('is-uploaded');
        updatePhotoControlsVisibility();
      }
    });
  }

  // Event pour ouvrir les modales
  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  // Fermeture modale via touche Echap
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
  });

  // Gestion de l'image uploadée
  if (chooseImageBtn && imageInput) {
    chooseImageBtn.addEventListener('click', function(e) {
      e.preventDefault();
      imageInput.click();
    });

    imageInput.addEventListener('change', function() {
      const file = imageInput.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.classList.add('is-uploaded');
          updatePhotoControlsVisibility();
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = 'assets/icons/photo.png';
        imagePreview.classList.remove('is-uploaded');
        updatePhotoControlsVisibility();
      }
    });
  }

  // Reset du formulaire d'ajout
  if (addWorkForm) {
    addWorkForm.addEventListener('reset', function() {
      imagePreview.src = 'assets/icons/photo.png';
      imagePreview.classList.remove('is-uploaded');
      if (imageInput) imageInput.value = "";
      updatePhotoControlsVisibility();
    });

    // Soumission du formulaire d'ajout de projet
    addWorkForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const title = document.getElementById('titre').value.trim();
      const category = document.getElementById('cat').value;
      const imageFile = imageInput.files[0];

      if (!title || !category || !imageFile) {
        alert('Veuillez remplir tous les champs et choisir une image.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('image', imageFile);

      try {
        const response = await fetch(`${API_BASE_URL}/works`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem(AUTH_TOKEN_KEY)
          },
          body: formData
        });

        if (response.ok) {
          const newWork = await response.json();
          worksData.push(newWork);
          renderWorks(worksData);
          updateModalGallery();
          addWorkForm.reset();
          imagePreview.src = "assets/icons/photo.png";
        } else if (response.status === 401) {
          alert('Non autorisé. Veuillez vous reconnecter.');
        } else {
          alert('Erreur lors de l\'ajout du projet.');
        }
      } catch (err) {
        alert('Erreur réseau');
      }
    });
  }

  // Initialise la visibilité au chargement
  updatePhotoControlsVisibility();
}
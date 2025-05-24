// 4. Set up modal
const modal1 = document.getElementById("modal1");
const modal2 = document.getElementById("modal2");

document.querySelector(".btn-add").addEventListener("click", function (e) {
  e.preventDefault();
  modal1.style.display = "none";
  modal2.style.display = "";
  populateCategoryDropdown();
});

document.querySelector(".back-btn").addEventListener("click", function (e) {
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

let modal = null;

function renderImagesInModal() {
  const modalGallery = document.querySelector(".modal-gallery");
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
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem(AUTH_TOKEN_KEY),
            'Accept': 'application/json',
          }
        });
        if ((response.ok)) {
          figure.remove();
          worksData = worksData.filter(work => work.id != workId);
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

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

//modal2 
async function populateCategoryDropdown() {
  const categories = await fetchData(`${API_BASE_URL}/categories`);
  const select = document.getElementById('cat');
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
}

//update photo
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const chooseImageBtn = document.getElementById('choose-image-btn');
const photoInfo = document.getElementById('photo-info');
const addWorkForm = document.getElementById('add-work-form');


// Fonction pour afficher/masquer le bouton et le paragraphe
function updatePhotoControlsVisibility() {
  if (imageInput.files.length > 0) {
    chooseImageBtn.style.display = "none";
    photoInfo.style.display = "none";
  } else {
    chooseImageBtn.style.display = "";
    photoInfo.style.display = "";
  }
}

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

// (Optionnel) Lors du reset du formulaire
if (addWorkForm) {
  addWorkForm.addEventListener('reset', function() {
    imagePreview.src = 'assets/icons/photo.png';
    imagePreview.classList.remove('is-uploaded');
    imageInput.value = "";
    updatePhotoControlsVisibility();
  });
}


// Initialise la visibilité au chargement
updatePhotoControlsVisibility();


//call API

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


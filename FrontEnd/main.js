// Récupération des travaux depuis l'API
// Récupération des travaux depuis l'API
async function fetchWorks() {
  try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des travaux');
      }
      const works = await response.json();
      return works;
  } catch (error) {
      console.error('Erreur :', error);
  }
}

// Affichage des travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  works.forEach((work) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const caption = document.createElement('figcaption');

      img.src = work.imageUrl;
      img.alt = work.title;
      caption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
  });
}

// Charger les travaux et les afficher
fetchWorks().then((works) => {
  if (works) {
      displayWorks(works);
  }
});

// Récupération des catégories depuis l'API
async function fetchCategories() {
  try {
      const response = await fetch('http://localhost:5678/api/categories');
      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
      }
      const categories = await response.json();
      return categories;
  } catch (error) {
      console.error('Erreur :', error);
  }
}

// Affichage des filtres de catégories
function displayFilters(categories) {
  const filtersContainer = document.querySelector('.filters');
  filtersContainer.innerHTML = '';

  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.dataset.categoryId = '';
  filtersContainer.appendChild(allButton);

  categories.forEach((category) => {
      const button = document.createElement('button');
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      filtersContainer.appendChild(button);
  });
}

fetchCategories().then((categories) => {
  if (categories) {
      displayFilters(categories);
  }
});

// Gestion des filtres
document.querySelector('.filters').addEventListener('click', (event) => {
  const categoryId = event.target.dataset.categoryId;

  fetchWorks().then((works) => {
      if (categoryId) {
          const filteredWorks = works.filter((work) => work.categoryId == categoryId);
          displayWorks(filteredWorks);
      } else {
          displayWorks(works);
      }
  });
});

// Sélection des éléments pour la modale
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const galleryView = document.getElementById('modal-gallery');
const addPhotoView = document.getElementById('modal-add-photo');
const addPhotoBtn = document.getElementById('add-photo-btn');
const backArrow = document.getElementById('back-arrow');
const galleryContent = document.getElementById('gallery-content');
const addPhotoForm = document.getElementById('add-photo-form');

// Ouvrir la modale
openModalBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  loadProjects(); // Charger les projets
});

// Fermer la modale
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Passer à la vue "Ajouter une photo"
addPhotoBtn.addEventListener('click', () => {
  galleryView.classList.add('hidden');
  addPhotoView.classList.remove('hidden');
});

// Flèche pour revenir à la galerie
backArrow.addEventListener('click', () => {
  addPhotoView.classList.add('hidden');
  galleryView.classList.remove('hidden');
});

// Gérer l'ajout de photo
addPhotoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('photo-title').value;
  const file = document.getElementById('photo-file').files[0];

  const projectDiv = document.createElement('div');
  projectDiv.classList.add('project');
  projectDiv.innerHTML = `
      <img src="${URL.createObjectURL(file)}" alt="${title}">
      <p>${title}</p>
  `;
  galleryContent.appendChild(projectDiv);

  addPhotoForm.reset();
  addPhotoView.classList.add('hidden');
  galleryView.classList.remove('hidden');
});

// Charger les projets dans la modale
async function loadProjects() {
  try {
      const response = await fetch('http://localhost:5678/api/works');
      const projects = await response.json();

      galleryContent.innerHTML = '';

      projects.forEach((project) => {
          const projectDiv = document.createElement('div');
          projectDiv.classList.add('project');
          projectDiv.innerHTML = `
              <img src="${project.imageUrl}" alt="${project.title}">
              <p>${project.title}</p>
              <button class="delete-btn" data-id="${project.id}">Supprimer</button>
          `;
          galleryContent.appendChild(projectDiv);
      });

      document.querySelectorAll('.delete-btn').forEach((button) => {
          button.addEventListener('click', (event) => {
              const projectId = event.target.dataset.id;
              deleteProject(projectId);
          });
      });
  } catch (error) {
      console.error('Erreur lors du chargement des projets :', error);
  }
}

// Suppression d'un projet
async function deleteProject(id) {
  try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
      });

      if (response.ok) {
          alert('Projet supprimé avec succès');
          loadProjects(); // Recharger les projets après suppression
      } else {
          alert('Erreur lors de la suppression du projet');
      }
  } catch (error) {
      console.error('Erreur lors de la suppression du projet :', error);
  }
}

openModalBtn.addEventListener('click', () => {
  modal.classList.remove('hidden'); // Affiche la modale
  loadSmallGallery(); // Charge la galerie avec des images réduites
});

function loadSmallGallery() {
  fetchWorks().then((works) => {
      const galleryContent = document.getElementById('gallery-content');
      galleryContent.innerHTML = ''; // Vide la galerie précédente

      if (works.length === 0) {
          const message = document.createElement('p');
          message.textContent = 'Aucun projet trouvé.';
          galleryContent.appendChild(message);
      } else {
          works.forEach((work) => {

              const projectDiv = document.createElement('div');
              projectDiv.classList.add('project-item'); 

              const img = document.createElement('img');
              img.src = work.imageUrl;
              img.alt = work.title;
              img.classList.add('small-image');

              const deleteIcon = document.createElement('button');
              deleteIcon.classList.add('delete-icon');
              deleteIcon.innerHTML = '&#128465;'; 
              deleteIcon.dataset.id = work.id;

             
              deleteIcon.addEventListener('click', () => {
                  deleteProject(work.id); 
              });

              projectDiv.appendChild(img);
              projectDiv.appendChild(deleteIcon);
              galleryContent.appendChild(projectDiv);
          });
      }
  });
}

async function deleteProject(id) {
  try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (response.ok) {
          alert('Projet supprimé avec succès');
          loadSmallGallery();
      } else {
          alert('Erreur lors de la suppression du projet');
      }
  } catch (error) {
      console.error('Erreur lors de la suppression du projet :', error);
  }
}

// Références aux éléments
const photoFileInput = document.getElementById('photo-file');
const photoPreview = document.querySelector('.photo-preview');
const photoForm = document.getElementById('add-photo-form');
const validateBtn = document.getElementById('validate-btn');
const categorySelect = document.getElementById('photo-category');

// Charger les catégories dynamiquement
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
    }
}

// Prévisualiser l'image sélectionnée
photoFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Prévisualisation" style="width:100%;border-radius:10px;">`;
        };
        reader.readAsDataURL(file);
    }
});

categorySelect.addEventListener('change', checkFormValidity)

// Activer/Désactiver le bouton "Valider"
function checkFormValidity() {
    const title = document.getElementById('photo-title').value;
    const category = categorySelect.value;
    const file = photoFileInput.files[0];
    console.log (title, category, file);

    if (title && category && file) {
        validateBtn.classList.add('active');
        validateBtn.disabled = false;
    } else {
        validateBtn.classList.remove('active');
        validateBtn.disabled = true;
    }
}


// Ajouter une photo via l'API
photoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('photo-title').value;
    const category = categorySelect.value;
    const file = photoFileInput.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert('Photo ajoutée avec succès !');
            photoForm.reset();
            photoPreview.innerHTML = `
                <label for="photo-file" class="upload-area">
                    <img src="assets/icons/default-image-icon.png" alt="Image par défaut" class="default-icon">
                    <p>+ Ajouter photo</p>
                    <small>jpg, png : 4mo max</small>
                </label>
            `;
            validateBtn.disabled = true;
            validateBtn.classList.remove('active');
        } else {
            alert('Erreur lors de l\'ajout de la photo.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo :', error);
    }
});

// Fonction pour fermer la modale
function closeModal() {
    modal.classList.add('hidden'); // Masque la modale
}

// Fermer la modale en cliquant sur la croix
closeModalBtn.addEventListener('click', closeModal);

// Fermer la modale en cliquant à l'extérieur
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

const validUser = {
  email: "sophie.bluel@test.tld", // Identifiant
  password: "S0phie"      // Mot de passe
};

// Route de connexion
fetch.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifier si les identifiants sont corrects
  if (email === validUser.email && password === validUser.password) {
      // Générer un token simulé
      const token = res.body.token; // Remplace par un vrai token si nécessaire
      res.status(200).json({ token });
      console.log(res);
  } else {
      // Si les identifiants sont incorrects
      res.status(401).json({ message: "Identifiants incorrects" });
  }
});


// Charger les catégories au démarrage
loadCategories();


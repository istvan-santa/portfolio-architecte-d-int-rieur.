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

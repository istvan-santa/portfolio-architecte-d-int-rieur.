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

    // Remplir les données
    img.src = work.imageUrl;
    img.alt = work.title; 
    caption.textContent = work.title; 

    // Ajouter les éléments dans le DOM
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

fetchCategories().then((categories) => {
  if (categories) {
    console.log(categories); // Vérifie les données
  }
});

function displayFilters(categories) {
  const filtersContainer = document.querySelector('.filters');
  filtersContainer.innerHTML = ''; 

  // Bouton "Tous"
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.dataset.categoryId = ''; 
  filtersContainer.appendChild(allButton);

  // Boutons pour chaque catégorie
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

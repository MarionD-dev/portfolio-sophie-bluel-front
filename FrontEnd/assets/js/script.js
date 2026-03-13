

// Variables globales
let allWorks = [];
let categories = [];

// Récupération travaux
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    allWorks = await response.json();
    return allWorks;
}

// Récupération catégories
async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    categories = await response.json();
    return categories;
}

// Affichage travaux galerie 
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Boutons filtres
function createFilterButtons() {
    const portfolioSection = document.querySelector('#portfolio');
    const gallery = document.querySelector('.gallery');
    
// Conteneur filtres
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'filters';
    
// Boutons
    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    btnAll.className = 'filter-btn active';
    btnAll.addEventListener('click', () => {
        displayWorks(allWorks);
        setActiveButton(btnAll);
    });
    filtersDiv.appendChild(btnAll);
    
// Boutons catégories
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category.name;
        btn.className = 'filter-btn';
        btn.addEventListener('click', () => {
            const filteredWorks = allWorks.filter(work => work.categoryId === category.id);
            displayWorks(filteredWorks);
            setActiveButton(btn);
        });
        filtersDiv.appendChild(btn);
    });
    
// Filtres galerie
    portfolioSection.insertBefore(filtersDiv, gallery);
}

// Gestion bouton actif
function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Utilisateur connecté
function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

// Mode édition
function displayEditMode() {

// Bandeau noir 
    const editBanner = document.createElement('div');
    editBanner.className = 'edit-banner';
    editBanner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
    document.body.prepend(editBanner);
    
// Login / Logout
    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = 'logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', logout);
    }
    
// Filtres masqués
    const filters = document.querySelector('.filters');
    if (filters) {
        filters.style.display = 'none';
    }
    
// Bouton modifier
    const portfolioTitle = document.querySelector('#portfolio h2');

    const modifyBtn = document.createElement('button');
    modifyBtn.className = 'modify-btn';
    modifyBtn.textContent = 'Modifier';

    modifyBtn.addEventListener('click', openModal);
    portfolioTitle.appendChild(modifyBtn);
}

// Déconnexion
function logout(e) {
    e.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}


// Ouvrir modale
function openModal() {
    document.querySelector('.overlay').classList.add('overlay--open');
    document.querySelector('.modal').classList.add('modal--open');
    displayWorksInModal();
}

// Fermer modale
function closeModal() {
    document.querySelector('.overlay').classList.remove('overlay--open');
    document.querySelector('.modal').classList.remove('modal--open');
}

// Afficher photos modale
function displayWorksInModal() {
    const modalGallery = document.querySelector('.modal_gallery');
    modalGallery.innerHTML = '';

    allWorks.forEach(work => {
        const item = document.createElement('div');
        item.className = 'modal_gallery_item';
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'modal_gallery_item_delete';
       deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>';
        
       
// Suppression photo clic
        deleteBtn.addEventListener('click', async () => {
            const token = localStorage.getItem("authToken");
            
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                allWorks = allWorks.filter(w => w.id !== work.id);
                displayWorks(allWorks);
                displayWorksInModal();
            } else {
                alert("Erreur lors de la suppression");
            }
        });
        
        item.appendChild(img);
        item.appendChild(deleteBtn);
        modalGallery.appendChild(item);
    });
}


// Afficher le formulaire
function afficherFormulaire() {
    document.querySelector('.modal_view_gallery').style.display = 'none';
    document.querySelector('.modal_view_form').style.display = 'block';
    document.querySelector('.modal_back').style.display = 'block';
    
    // Reset formulaire
    document.getElementById('form_add_work').reset();
    
    // Reset prévisualisation
    const preview = document.getElementById('image_preview');
    const uploadZone = document.getElementById('upload_zone');
    
    preview.style.display = 'none';
    preview.src = '';
    uploadZone.querySelector('svg').style.display = 'block';
    uploadZone.querySelector('label').style.display = 'block';
    uploadZone.querySelector('p').style.display = 'block';
    
    const select = document.getElementById('work_category');
    select.innerHTML = '<option value=""></option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Afficher la galerie
function afficherGalerie() {
    document.querySelector('.modal_view_gallery').style.display = 'block'; 
    document.querySelector('.modal_view_form').style.display = 'none';
    document.querySelector('.modal_back').style.display = 'none';
}

// Bouton valider si complet
function verifierFormulaire() {
    const image = document.getElementById('image_input').files.length > 0;
    const titre = document.getElementById('work_title').value.trim() !== '';
    const categorie = document.getElementById('work_category').value !== '';
    const bouton = document.getElementById('submit_btn');
    const formTouched = image || titre || categorie;

    bouton.disabled = !(image && titre && categorie);

    if (formTouched && !(image && titre && categorie)) {
        document.getElementById('form_error').style.display = 'block';
    } else {
        document.getElementById('form_error').style.display = 'none';
    }
}

// Prévisualisation de l'image
function previsualiserImage() {
    const fileInput = document.getElementById('image_input');
    const preview = document.getElementById('image_preview');
    const uploadZone = document.getElementById('upload_zone');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();

// Aperçu
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            
// Cache contenu
            uploadZone.querySelector('svg').style.display = 'none';
            uploadZone.querySelector('label').style.display = 'none';
            uploadZone.querySelector('p').style.display = 'none';
        };

        reader.readAsDataURL(file);
    }
}

// Formulaire API
async function envoyerFormulaire(e) {
    e.preventDefault();

    const image = document.getElementById('image_input').files[0];
    const titre = document.getElementById('work_title').value;
    const categorie = document.getElementById('work_category').value;

    if (!image || !titre || !categorie) {
        document.getElementById('form_error').style.display = 'block';
        return;
    }
    document.getElementById('form_error').style.display = 'none';

    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', titre);
    formData.append('category', categorie);

    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    if (response.ok) {
        const nouveauProjet = await response.json();
        allWorks.push(nouveauProjet);
        displayWorks(allWorks);
        afficherGalerie();
        displayWorksInModal();
        document.getElementById('form_add_work').reset();
    } else {
        alert("Erreur lors de l'ajout");
    }
}

// Initialisation
async function init() {
    await getWorks();
    await getCategories();
    displayWorks(allWorks);

    if (isUserLoggedIn()) {
        displayEditMode();
    } else {
        createFilterButtons();
    }

    document.querySelector('.overlay').addEventListener('click', closeModal);
    document.querySelector('.modal_close').addEventListener('click', closeModal);

    document.getElementById('btn_add_photo').addEventListener('click', afficherFormulaire);
    document.querySelector('.modal_back').addEventListener('click', afficherGalerie);

    document.getElementById('work_title').addEventListener('input', verifierFormulaire);
    document.getElementById('work_category').addEventListener('change', verifierFormulaire);
    document.getElementById('image_input').addEventListener('change', () => {
    previsualiserImage();
    verifierFormulaire();
    });

    document.getElementById('form_add_work').addEventListener('submit', envoyerFormulaire); 
}

init();
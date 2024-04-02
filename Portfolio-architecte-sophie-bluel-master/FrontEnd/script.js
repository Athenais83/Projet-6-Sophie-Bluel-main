let works = [];
async function loadWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  displayWorks(works);
}
loadWorks();

function displayWorks(filterWorks) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML="";
  filterWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    const worksImage = document.createElement("img");
    worksImage.src = work.imageUrl;
    worksImage.alt = work.title;
    figure.appendChild(worksImage);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

let categories = [];
async function loadCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();
  displaycategories();
}
loadCategories();

const buttonFilter= document.querySelector(".buttonFilter");

function displaycategories(){
  const button= document.createElement("button");
    button.innerHTML="Tous";
    buttonFilter.appendChild(button); 
    button.addEventListener("click", function(){
      document.querySelectorAll('.buttonFilter button').forEach(btn =>{
        btn.classList.remove('selected');
      });
      button.classList.add('selected');
      displayWorks(works);
    })

  categories.forEach((category) => {
    const button= document.createElement("button");
    button.innerHTML= category.name;
    buttonFilter.appendChild(button); 
    button.addEventListener("click", function(){
      document.querySelectorAll('.buttonFilter button').forEach(btn =>{
        btn.classList.remove('selected');
      });
      button.classList.add('selected');
      let objetsWork= works.filter((work)=> work.categoryId === category.id);
      displayWorks(objetsWork);
    })
  })
};

function displayEditMode() {
  console.log("fonction displayeditmode called.");
  const header = document.querySelector("header");
  
  const editModeDiv = document.createElement("div");
  editModeDiv.innerHTML = `
 <p>Mode édition</p>
 <img src="./assets/icons/edition.png">`;
  editModeDiv.classList.add("bandeau-edition")
  
  header.appendChild(editModeDiv);

  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = `
  <p>modifier</p>
  <img src="./assets/icons/modifier.png">`;
  buttonEdit.classList.add("btn-modifier")

  titre.appendChild(buttonEdit);

  buttonEdit.addEventListener("click", function(e) {
    console.log("modale créer")
      e.preventDefault();
      createModal();
  });
}


function createModal(){
  const modal = document.querySelector(".modal");
  modal.innerHTML="";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const titleModal = document.createElement("p");
  titleModal.classList.add("title-modal");
  titleModal.innerHTML = "Galerie Photo";
  modalContent.appendChild(titleModal);

  const modalProjet = document.createElement("div");
  modalProjet.classList.add("modal-projet");
  modalContent.appendChild(modalProjet);

  const closeButton = document.createElement("button");
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeButton.classList.add("close");
  modalContent.appendChild(closeButton);
  
  const listWorks = document.createElement("div")
  listWorks.classList.add("list-works")
  modalContent.appendChild(listWorks)

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.classList.add("modal-work");
    const figcaption = document.createElement("figcaption");
    const worksImage = document.createElement("img");
    worksImage.src = work.imageUrl;
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function() {
      
      const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':"Bearer "+localStorage.getItem("token")
        }
    };
  
    fetch('http://localhost:5678/api/works/'+ work.id, options)
    
    .then(async data => {
      await loadWorks();
      createModal();
  })
  .catch(error => {
      console.error('Erreur lors de la connexion :', error);
  });
      console.log("Supprimer le projet :", work.title);
    });
    figure.appendChild(worksImage);
    figure.appendChild(figcaption);
    figure.appendChild(deleteButton);
    listWorks.appendChild(figure);
  });

  modal.appendChild(modalContent);

  document.body.appendChild(modal);
  modal.style.display = "block";

  
  closeButton.onclick = function(){
    modal.style.display = "none";
  }

  window.onclick = function(event){
    if(event.target == modal){
      modal.style.display = "none";
    }
  }

  addProject();
};

function addProject(){
  console.log("cette fonction est appeler");
  const buttonadd = document.createElement("div");
  buttonadd.classList.add("div-button-add");
  const btnAdd = document.createElement("button");
  btnAdd.classList.add("btn-add");
  btnAdd.innerHTML ="Ajouter une photo";

  const lineImage = document.createElement("img");
  lineImage.src = "./assets/icons/Line.png"; 
  lineImage.classList.add("line-image");

  buttonadd.appendChild(lineImage);
  buttonadd.appendChild(btnAdd);
  
  document.querySelector(".modal-content").appendChild(buttonadd);

  btnAdd.addEventListener("click", function(e){
      e.preventDefault();
      modalProjet();
  });

}
  window.onload = function() {
  const editModeEnabled = localStorage.getItem('token');
  if (editModeEnabled) {
    displayEditMode();
    const loginLink = document.getElementById('loginLink');
    loginLink.innerHTML = 'Log out';
    loginLink.onclick = function() {
      localStorage.removeItem('token');
      window.location.href = "./index.html";
    };
} 
 };

 async function modalProjet() {
  console.log("fonction modalProjet est appelée");

  const modalContent = document.querySelector(".modal-content");

  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
    
  const form = document.createElement("form");
  form.classList.add("form-add-projet")
  form.innerHTML = `
    <div class="icon">
    <img class="arrow-left" alt="précédents" src="./assets/icons/arrow-left.png" onclick="createModal()" />
    <input type = "image" class="close-btn" alt="fermer" src="./assets/icons/close.png" />
    </div>
    <p class="title-modal-project">Ajout photo</p>
    <div class="photo">
    <img src="./assets/icons/Vector.png" alt="" class="img-form">
    <div class="custom-file-upload">
    <label for="image" class="ajout-photo">+ Ajouter photo</label>
    <input type="file" id="image" class="ajout" name="image" accept="image/*" required>
    </div>
    <p class="format">jpg.png : 4mo max </p>
    <img id="image-preview" src="#" alt="Aperçu de votre image" style="display: none; max-width: 100px; max-height: 150px;">
    </div>
    <libelle class="libelle">Titre</libelle>
    <input type="text" class="projectTitle" name="projectTitle" required>
    <libelle class="libelle">Catégories</libelle>
    <select class="selectCategories" name="Categories" required>
    </select>
    <button type="submit" class="btn-valider">Valider</button>
  `;

  const selectCategories = form.querySelector('.selectCategories');
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategories.appendChild(option);
  });

  const closeButton = form.querySelector('.close-btn');
  closeButton.addEventListener('click', function() {
    closeModal();
  });

  const imageInput = form.querySelector('#image');
  const imagePreview = form.querySelector('#image-preview');
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
       
        form.querySelector('.img-form').style.display = 'none';
        form.querySelector('.custom-file-upload').style.display = 'none';
        form.querySelector('.format').style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = '#';
      imagePreview.style.display = 'none';
      
      form.querySelector('.img-form').style.display = 'block';
      form.querySelector('.custom-file-upload').style.display = 'block';
      form.querySelector('.format').style.display = 'block';
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.querySelector('.projectTitle').value;
    const categories = document.querySelector('.selectCategories').value;
    
    const formData = new FormData(form);
    formData.append('title', title);
    formData.append('category', categories);
    

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token")
      }
    };

    try {
      const response = await fetch('http://localhost:5678/api/works', options);
      if (response.ok) {
        await loadWorks(); 
        closeModal(); // Fermer la modal après l'ajout du projet
      } else {
        console.error("Erreur lors de l'ajout du projet", response.statusText);
      }
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
  }
  });

  const lineImage = document.createElement("img");
    lineImage.src = "./assets/icons/Line.png"; 
    lineImage.classList.add("line"); 

    const btnValider = form.querySelector('.btn-valider');
    btnValider.parentNode.insertBefore(lineImage, btnValider);

  modalContent.innerHTML = '';
  modalContent.appendChild(form);

};

function closeModal(){
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}



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
      displayWorks(works);
    })
  categories.forEach((category) => {
    const button= document.createElement("button");
    button.innerHTML= category.name;
    buttonFilter.appendChild(button); 
    button.addEventListener("click", function(){
      let objetsWork= works.filter((work)=> work.categoryId === category.id);
      displayWorks(objetsWork);
    })
  })
};

function displayEditMode() {
  console.log("fonction displayeditmode called.");
  const header = document.querySelector("header");
  
  const editModeDiv = document.createElement("div");
  editModeDiv.innerHTML = "Mode édition";
  editModeDiv.classList.add("bandeau-edition")
  
  header.parentNode.insertBefore(editModeDiv, header);

  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = "Modifier";
  buttonEdit.classList.add("btn-modifier")
  buttonFilter.innerHTML = "";
  buttonFilter.appendChild(buttonEdit);

  buttonEdit.addEventListener("click", function(e) {
    console.log("modale créer")
      e.preventDefault();
      const modal = document.createElement("div");
      modal.classList.add("modal");

      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      
      works.forEach(work => {
        const figure = document.createElement("figure");
        figure.classList.add("modal-work");
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = work.title;
        const worksImage = document.createElement("img");
        worksImage.src = work.imageUrl;
        worksImage.alt = work.title;
        figure.appendChild(worksImage);
        figure.appendChild(figcaption);
        modalContent.appendChild(figure);
      });
      
      modal.appendChild(modalContent);

    const closeButton = document.createElement("button");
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.classList.add("close");
    modalContent.appendChild(closeButton);

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
  });
}

  const buttonSubmit = document.getElementById("submit")
  buttonSubmit.addEventListener("click", function(e){
  e.preventDefault();
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  loginUser(email, password)
});

function loginUser(email, password) {
  const data = {
      email: email,
      password: password
  };

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };

  fetch('http://localhost:5678/api/users/login', options)
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Email ou mot de passe incorrect.');
      }
  })
  .then(data => {
    const token = data.token;
    localStorage.setItem('token', token); 
    localStorage.setItem('editModeEnabled', true); // Indiquer que le mode d'édition est activé
    window.location.href="./index.html";
})
.catch(error => {
    console.error('Erreur lors de la connexion :', error);
});
}

// Vérifier si le mode d'édition est activé lors du chargement de la page
window.onload = function() {
const editModeEnabled = localStorage.getItem('editModeEnabled');
if (editModeEnabled) {
    displayEditMode(); // Afficher le mode d'édition si activé
}
};

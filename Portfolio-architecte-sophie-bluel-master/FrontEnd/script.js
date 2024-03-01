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

  const buttonSubmit = document.getElementById("submit")
  buttonSubmit.addEventListener("click", function(e){
  e.preventDefault()
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
      window.location.href="/index.html"
      displayEditMode();
})

  .catch(error => {
      console.error('Erreur lors de la requête:', error);
      alert('Une erreur est survenue lors de la connexion.');
  })
};

function displayEditMode() {
  const header = document.querySelector("header");
  
  // Création du div pour le mode édition
  const editModeDiv = document.createElement("div");
  editModeDiv.innerHTML = "Mode édition";
  editModeDiv.style.padding = "10px";
  editModeDiv.style.backgroundColor = "#f0f0f0";
  editModeDiv.style.textAlign = "center";
  
  // Ajout du div au header
  header.insertBefore(editModeDiv, header.firstChild);

  // Remplacement des boutons de filtres par un bouton "Modifier"
  const buttonEdit = document.createElement("button");
  buttonEdit.innerHTML = "Modifier";
  buttonFilter.innerHTML = ""; // Effacement des boutons de filtres existants
  buttonFilter.appendChild(buttonEdit);

  // Ajout d'un écouteur d'événement pour le bouton "Modifier"
  buttonEdit.addEventListener("click", function() {
      // Code pour le mode d'édition ici
      // Par exemple, vous pouvez ajouter des fonctionnalités de modification
      console.log("Mode édition activé");
  });
}

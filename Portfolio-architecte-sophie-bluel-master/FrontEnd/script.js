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
  buttonFilter.style.display = "";

  buttonFilter.parentNode.insertBefore(buttonEdit, buttonFilter);

  buttonEdit.addEventListener("click", function(e) {
    console.log("modale créer")
      e.preventDefault();
      createModal();
      addProject();
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
}

window.onload = function() {
const editModeEnabled = localStorage.getItem('token');
if (editModeEnabled) {
    displayEditMode();
}
};

function addProject(){
  console.log("cette fonction est appeler");
    const buttonadd = document.createElement("div")
    buttonadd.classList.add("div-button-add")
    
document.querySelector(".modal-content").appendChild(buttonadd);
    const btnAdd = document.createElement("button")
    btnAdd.classList.add("btn-add")
    btnAdd.innerHTML ="Ajouter une photo"
    buttonadd.appendChild(btnAdd)

    btnAdd.addEventListener("click", function(e){
    e.preventDefault();
    modalProjet();
  });
    
 };

function modalProjet(){
  console.log("fonction modalProjet est appeler")
  const modalAddProjet = document.createElement("div")
    modalAddProjet.classList.add("modal-add-projet")

    const modalContentProjet = document.createElement("div")
    modalContentProjet.classList.add("modal-content-projet")
    const formData = new FormData();

formData.append("username", "Groucho");
formData.append("accountnum", 123456); // le numéro 123456 est converti immédiatement en chaîne "123456"

// fichier HTML choisi par l'utilisateur
formData.append("userfile", fileInputElement.files[0]);

// objet JavaScript de type fichier
const content = '<q id="a"><span id="b">hey!</span></q>'; // le corps du nouveau fichier…
const blob = new Blob([content], { type: "text/xml" });

formData.append("webmasterfile", blob);

const request = new XMLHttpRequest();
request.open("POST", "https://example.com/submitform.php");
request.send(formData);



    modalAddProjet.appendChild(modalContentProjet);


};
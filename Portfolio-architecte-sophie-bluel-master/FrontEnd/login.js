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
    localStorage.getItem('editModeEnabled', true); 
    window.location.href="./index.html";
    displayEditMode();
})
.catch(error => {
    console.error('Erreur lors de la connexion :', error);
});
}

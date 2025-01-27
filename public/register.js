// on doit ajouter un gestionnaire d'événement pour le formulaire d'inscription
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value; //on doit Récupèrer les valeurs saisies dans les champs "username" et "password"
    const password = document.getElementById('password').value;
  
    // Envoie une requête POST au serveur pour enregistrer un nouvel utilisateur
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
   // Vérificatin si l'enregistrement a bien  réussi
    if (response.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = '/public/login.html'; // Redirection vers la page de login
    } else {
      alert('Registration failed. User may already exist.'); // Affichage d'un message d’erreur au cas où les données ne sont pas validées.

    }
  });
  
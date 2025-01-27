// on doit ajouter un gestionnaire d'événement pour le formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;//on doit Récupèrer les valeurs saisies dans les champs "username" et "password"
    const password = document.getElementById('password').value;
  // Envoie une requête POST au serveur pour authentifier l'utilisateur
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
  // Vérifie la réponse du serveur pour savoir si la connexion est réussie
    if (response.ok) {
      window.location.href = '/protected/index.html';  // Si les identifiants sont valides, on doit rediriger l'utilisateur vers la page principale protégée
    } else {
      alert('Login failed. Please check your credentials.');  // Si la connexion échoue, on doit afficher un message d'erreur
    }
  });
  
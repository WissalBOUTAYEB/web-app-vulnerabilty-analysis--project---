async function fetchTasks() {   // pour Récupèrer et afficher les tâches depuis le serveur

    const response = await fetch('/tasks');// Requête pour récupérer les tâches
    if (response.ok) {
      const tasks = await response.json();
      const tbody = document.querySelector('#taskTable tbody');// pour Sélectionner le corps du tableau
      tbody.innerHTML = '';
      tasks.forEach((task) => {
        const row = document.createElement('tr');// pour  Créer une nouvelle ligne pour le tableau
        row.innerHTML = `
          <td>${task.task}</td>
          <td>
            <button onclick="deleteTask(${task.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(row); // pour Ajouter la ligne au tableau
      });
    }
  }
  
  document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = document.getElementById('task').value;//pour  Récupèrer la valeur de la tâche saisie
  
    const response = await fetch('/add', {
      method: 'POST', // Envoie une requête POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),// l'Envoie de  la tâche au format JSON
    });
  
    if (response.ok) {
      fetchTasks();
      document.getElementById('task').value = '';
    } else {
      alert('Failed to add task.');
    }
  });
  // Supprime une tâche par son ID
  async function deleteTask(taskId) {
    const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });// Envoie une requête DELETE
    if (response.ok) {
      fetchTasks();
    } else {
      alert('Failed to delete task.');
    }
  }
  // Récupèration et affichage des tâches lors de chargement de la page
  fetchTasks();
  
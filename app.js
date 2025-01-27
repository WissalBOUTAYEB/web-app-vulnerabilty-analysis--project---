// Importation des modules nécessaires
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Initialisation de l'application
const app = express();
const PORT = 3000;
const DATA_FILE = "./database.json";

// Middleware pour le parsing du JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de session sécurisé
app.use(
  session({
    secret: 'mysecretkey',  // Une clé secrète pour sécuriser les sessions
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },  
  })
);

// Middleware de protection des routes privées
app.use('/protected', (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
});

// Serveur les fichiers statiques
app.use('/public', express.static('public')); // Routes non protégées pour login et register
app.use('/protected', express.static('private/protected')); // Routes protégées pour les utilisateurs authentifiés

// Fonction pour lire les données dans le fichier JSON
const readData = async () => {
  try {
    const data = await fs.promises.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erreur de lecture des données:', err);
    throw err;
  }
};

// Fonction pour écrire les données dans le fichier JSON
const writeData = async (data) => {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Erreur d\'écriture des données:', err);
    throw err;
  }
};

// Routes

// Route d'accueil
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/public/login.html');
  }
  res.redirect('/protected/index.html');
});

// Route d'enregistrement
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await readData();
    const userExists = data.users.find((u) => u.username === username);

    if (userExists) {
      return res.status(400).send('User already exists');
    }

    // Hashage du mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);
    data.users.push({ username, password: hashedPassword });
    await writeData(data);
    res.status(201).send('User registered successfully');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await readData();
    const user = data.users.find((u) => u.username === username);

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      return res.redirect('/protected/index.html');
    } else {
      return res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Route du dashboard (protégée)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }
  res.redirect('/protected/dashboard.html');
});

// Route pour ajouter une tâche
app.post('/add', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  const { task } = req.body;
  try {
    const data = await readData();
    const taskId = Date.now();
    data.tasks.push({ id: taskId, task, user: req.session.user.username });
    await writeData(data);

    res.redirect('/protected/dashboard.html');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Route pour récupérer les tâches de l'utilisateur connecté
app.get('/tasks', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const data = await readData();
    const userTasks = data.tasks.filter(task => task.user === req.session.user.username);
    res.json(userTasks);
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Route pour supprimer une tâche
app.delete('/tasks/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  const id = parseInt(req.params.id, 10);
  try {
    const data = await readData();
    data.tasks = data.tasks.filter(t => t.id !== id);
    await writeData(data);

    res.send('Task deleted');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

// Route de déconnexion
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/public/login.html');
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const app = express();
const PORT = 3000;
// Midlleware pour parser le json
app.use(express.json());

//Les donnees de l'application
let tasks = []; // Tableau pour stocker les tâches
let nextId = 1; // ID auto-incrémenté

//Route d'accueil
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API To-Do List!" });
});

// GET /tasks : Récupérer toutes les tâches
app.get('/tasks', (req,res) => {
    res.json(tasks);
});
// GET /tasks/:id : Récupérer une tâche spécifique
app.get('/tasks/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task){
        res.json(task);
    } else {
        res.status(404).json({ message : "Tâche non trouvée"});
    }
});
// POST /tasks : Ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Le titre est requis" });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ message: "La valeur de 'completed' doit être un booléen" });
    }
    const newTask = { id: nextId++, title, completed: completed || false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});
// PUT /tasks/:id : Modifier une tâche
app.put('/tasks/:id' , (req,res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        const { title, completed} = req.body;
        if(title){
            task.title = title;
        }
        if (completed !== undefined){
            task.completed = completed;
        }
        res.json(task);
    } else {
        res.status(404).json({ message : "Tâche non trouvée"});
    }
    
});
// DELETE /tasks/:id : Supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Tâche non trouvée" });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).end();
});
// Ecoute du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
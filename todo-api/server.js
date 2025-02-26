const http = require('http');
const { v4: uuidv4 } = require('uuid'); // Génération d'ID unique
const url = require('url');

let tasks = []; // Tableau en mémoire pour stocker les tâches

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Définition des en-têtes de réponse
    res.setHeader('Content-Type', 'application/json');

    // 🟢 Accueil de l'API
    if (method === 'GET' && path === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Bienvenue sur l'API To-Do List!" }));
    }
    // 🟢 GET /tasks : Récupérer toutes les tâches
    else if (method === 'GET' && path === '/tasks') {
        res.writeHead(200);
        res.end(JSON.stringify(tasks));
    }
    // 🟢 GET /tasks/:id : Récupérer une tâche spécifique
    else if (method === 'GET' && path.startsWith('/tasks/')) {
        const id = path.split('/')[2];
        const task = tasks.find(t => t.id === id);
        if (task) {
            res.writeHead(200);
            res.end(JSON.stringify(task));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Tâche non trouvée" }));
        }
    }
    // 🟢 POST /tasks : Ajouter une nouvelle tâche
    else if (method === 'POST' && path === '/tasks') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (!title) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: "Le titre est requis" }));
                    return;
                }
                const newTask = { id: uuidv4(), title, completed: false };
                tasks.push(newTask);
                res.writeHead(201);
                res.end(JSON.stringify(newTask));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Format JSON invalide" }));
            }
        });
    }
    // 🟢 PUT /tasks/:id : Modifier une tâche
    else if (method === 'PUT' && path.startsWith('/tasks/')) {
        const id = path.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { title, completed } = JSON.parse(body);
                const task = tasks.find(t => t.id === id);
                if (task) {
                    if (title !== undefined) task.title = title;
                    if (completed !== undefined) task.completed = completed;
                    res.writeHead(200);
                    res.end(JSON.stringify(task));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: "Tâche non trouvée" }));
                }
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Format JSON invalide" }));
            }
        });
    }
    // 🟢 DELETE /tasks/:id : Supprimer une tâche
    else if (method === 'DELETE' && path.startsWith('/tasks/')) {
        const id = path.split('/')[2];
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            res.writeHead(204); // No Content
            res.end();
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Tâche non trouvée" }));
        }
    }
    // 🔴 Route non trouvée
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route non trouvée" }));
    }
});

// Démarrer le serveur
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Archivo Swagger

const app = express();
app.use(bodyParser.json());

// Base de datos simulada
let tasks = [];
let currentId = 1;

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API Restful. Usa /tasks para interactuar con las tareas. Documentación en /api-docs.');
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filteredTasks = tasks.filter(task => task.status === status);
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

// Obtener una tarea por ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Crear una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description, status } = req.body;
    const newTask = { id: currentId++, title, description, status, created_at: new Date() };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Actualizar una tarea completamente
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        const { title, description, status } = req.body;
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.updated_at = new Date();
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Actualizar parcialmente una tarea
app.patch('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        const { title, description, status } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        task.updated_at = new Date();
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
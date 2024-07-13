const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const USE_IN_MEMORY = true
const POD_NAME = process.env.POD_NAME || 'default-pod';

// In-memory datastore
let todos = [];

//PostgreSQL datastore
const pool = new Pool({
  user: 'yourusername',
  host: 'localhost',
  database: 'yourdatabase',
  password: 'yourpassword',
  port: 5432,
});

// Serve the UI
app.get('/', (req, res) => {
  const indexFilePath = __dirname + '/index.html';
  const indexFileContent = fs.readFileSync(indexFilePath, 'utf-8');
  const updatedIndexFileContent = indexFileContent.replace(/\$POD_NAME\$/g, POD_NAME);
  res.send(updatedIndexFileContent);
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  let result;
  if (USE_IN_MEMORY) {
    result = todos;
  } else {
    const { rows } = await pool.query('SELECT * FROM todos');
    result = rows;
  }
  res.json({ todos: result, pod: POD_NAME });
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  const todo = req.body.todo;
  if (USE_IN_MEMORY) {
    todos.push({ id: todos.length + 1, text: todo });
  } else {
    await pool.query('INSERT INTO todos (text) VALUES ($1)', [todo]);
  }
  res.json({ success: true, pod: POD_NAME });
});

// Initialize PostgreSQL table if not using in-memory
if (!USE_IN_MEMORY) {
  pool.query('CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, text VARCHAR(255) NOT NULL)')
    .then(() => {
      console.log('PostgreSQL table initialized');
    })
    .catch(err => console.error('Error initializing PostgreSQL table', err));
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

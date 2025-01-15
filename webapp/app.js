const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Add JSON parsing middleware
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Initialize database table
async function initializeDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDb();

// Serve static HTML for the root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Todo App</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .todo-item { padding: 10px; border-bottom: 1px solid #eee; }
        .todo-form { margin-bottom: 20px; }
        input[type="text"] { padding: 8px; width: 300px; }
        button { padding: 8px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        button:hover { background: #45a049; }
      </style>
    </head>
    <body>
      <h1>Todo List</h1>
      
      <div class="todo-form">
        <input type="text" id="todoInput" placeholder="Enter a new todo">
        <button onclick="addTodo()">Add Todo</button>
      </div>

      <div id="todoList"></div>

      <script>
        // Load todos on page load
        loadTodos();

        function loadTodos() {
          fetch('/todos')
            .then(response => response.json())
            .then(todos => {
              const todoList = document.getElementById('todoList');
              todoList.innerHTML = todos
                .map(todo => \`
                  <div class="todo-item">
                    <span>\${todo.name}</span>
                    <small style="color: #666">
                      (Created: \${new Date(todo.created_at).toLocaleString()})
                    </small>
                  </div>
                \`)
                .join('');
            })
            .catch(error => console.error('Error loading todos:', error));
        }

        function addTodo() {
          const input = document.getElementById('todoInput');
          const name = input.value.trim();
          
          if (!name) return;

          fetch('/todos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
          })
          .then(response => response.json())
          .then(() => {
            input.value = ''; // Clear input
            loadTodos();      // Reload the list
          })
          .catch(error => console.error('Error adding todo:', error));
        }

        // Allow Enter key to submit
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            addTodo();
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.get('/hello', (req, res) => {
  res.json({
    message: "hello world",
    timestamp: new Date().toISOString()
  });
});

// Add new TODO
app.post('/todos', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(
      'INSERT INTO todos (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all TODOs
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
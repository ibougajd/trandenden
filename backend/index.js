const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'database', // docker-compose service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello World from Endpoint!" });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    const time = result.rows[0].now;
    client.release();
    res.json({ message: "Database connection successful", time: time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

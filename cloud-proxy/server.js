require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Basic CORS - restrict in production
app.use(cors());
app.use(bodyParser.json());

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in environment. Exiting.');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

// GET /projects -> list projects
app.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db_error' });
  }
});

// POST /projects -> upsert a project (expects JSON body matching columns)
app.post('/projects', async (req, res) => {
  try {
    const p = req.body;
    if (!p || !p.id) return res.status(400).json({ error: 'missing_id' });

    // Insert or update using ON CONFLICT (id) DO UPDATE
    const query = `INSERT INTO projects (id, title, description, "image url", tags, created_at)
                   VALUES ($1, $2::json, $3::json, $4::json, $5::json, COALESCE($6::timestamp, now()))
                   ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, "image url" = EXCLUDED."image url", tags = EXCLUDED.tags RETURNING *`;

    const values = [p.id, JSON.stringify(p.title || null), JSON.stringify(p.description || null), JSON.stringify(p['image'] || p['image url'] || null), JSON.stringify(p.tags || null), p.created_at || null];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db_error' });
  }
});

app.listen(port, () => console.log(`Veluna proxy listening on http://localhost:${port}`));

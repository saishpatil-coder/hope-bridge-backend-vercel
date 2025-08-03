import pool from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all requirements
        const result = await pool.query('SELECT * FROM requirements');
        res.json(result.rows);
        break;

      case 'POST':
        // Add new requirement
        const { name, quantity, added_by } = req.body;
        const insertResult = await pool.query(
          'INSERT INTO requirements (name, quantity, added_by) VALUES ($1, $2, $3) RETURNING *',
          [name, quantity, added_by]
        );
        res.status(201).json(insertResult.rows[0]);
        break;

      case 'DELETE':
        // Delete requirement by ID
        const { id } = req.query;
        const deleteResult = await pool.query('DELETE FROM requirements WHERE requirement_id = $1 RETURNING *', [id]);
        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: 'Requirement not found' });
        }
        res.json({ message: 'Requirement deleted' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
} 
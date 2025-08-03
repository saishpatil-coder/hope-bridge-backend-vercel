import pool from '../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all expenditures
        const result = await pool.query('SELECT * FROM expenditure');
        res.json(result.rows);
        break;

      case 'POST':
        // Add new expenditure
        const { purpose, amount, receipt, added_by, admin } = req.body;
        const insertResult = await pool.query(
          'INSERT INTO expenditure (purpose, amount, receipt, added_by, admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [purpose, amount, receipt, added_by, admin]
        );
        res.status(201).json(insertResult.rows[0]);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
} 
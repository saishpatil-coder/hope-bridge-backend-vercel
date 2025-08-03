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
        // Check if user_id is provided in query params
        const { user_id } = req.query;
        
        if (user_id) {
          // Get donations for a specific user
          const result = await pool.query(
            'SELECT * FROM payment_donations WHERE user_id = $1',
            [user_id]
          );
          res.json(result.rows);
        } else {
          // Get all donations
          const result = await pool.query('SELECT * FROM payment_donations');
          res.json(result.rows);
        }
        break;

      case 'POST':
        // Add a new donation
        const { requirement_id, amount, transaction_id } = req.body;
        const user_id_from_body = req.body.user_id; // Get user_id from body for POST
        
        const insertResult = await pool.query(
          'INSERT INTO payment_donations (user_id, requirement_id, amount, transaction_id) VALUES ($1, $2, $3, $4) RETURNING *',
          [user_id_from_body, requirement_id, amount, transaction_id]
        );
        res.status(201).json(insertResult.rows[0]);
        break;

      case 'DELETE':
        // Delete donation by ID
        const { id } = req.query;
        const deleteResult = await pool.query('DELETE FROM payment_donations WHERE donation_id = $1 RETURNING *', [id]);
        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: 'Donation not found' });
        }
        res.json({ message: 'Donation deleted' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
} 
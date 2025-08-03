import pool from '../../db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, address, phone } = req.body;
  console.log(req.body);
  
  try {
    const result = await pool.query(
      "INSERT INTO admins (username , password , address , phone_number) values ($1,$2,$3,$4)",
      [username, password, address, phone]
    );
    res.json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Server error" });
  }
} 
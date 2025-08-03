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
        // Get all medical requirements
        console.log("requirements backend");
        const result = await pool.query("SELECT * FROM medical_requirements");
        res.json(result.rows);
        break;

      case 'POST':
        // Add new medical requirement
        console.log("POST request body:", req.body);
        const { resident_id, diseaseName, amount, prescription_given } = req.body;

        // Note: File upload handling would need to be implemented differently for Vercel
        // For now, we'll store the file path as a string
        const medicalProof = ""; // File handling would need to be implemented separately

        const insertResult = await pool.query(
          "INSERT INTO medical_requirements (resident_name, diseaseName, amount, prescription_given, medicalProof) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [resident_id, diseaseName, amount, prescription_given, medicalProof]
        );
        
        console.log("Inserted row:", insertResult.rows[0]);
        res.status(201).json({
          msg: "success",
          data: insertResult.rows[0],
        });
        break;

      case 'DELETE':
        // Delete medical requirement by ID
        const { id } = req.query;
        const deleteResult = await pool.query(
          "DELETE FROM medical_requirements WHERE medical_req_id = $1 RETURNING *",
          [id]
        );
        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: "Medical requirement not found" });
        }
        res.json({ message: "Medical requirement deleted" });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Server error" });
  }
} 
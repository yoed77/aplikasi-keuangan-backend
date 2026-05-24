const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// SAKLAR SAKTI: Memaksa Node.js di Vercel mengizinkan sertifikat Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());
app.use(express.json());

// KONEKSI LANGSUNG MENGGUNAKAN CONNECTION STRING RESMI SUPABASE MAS YUDI
const pool = new Pool({
  connectionString: "postgresql://postgres.izetebcctiwzkesmyulm:Riva01Rana02@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', (req, res) => {
  res.send('🚀 Backend Cloud Mas Yudi Aktif Sempurna!');
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kategori ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, k.name AS category_name, k.type AS category_type
      FROM transaksi t
      LEFT JOIN kategori k ON t.category_id = k.id
      ORDER BY t.date DESC, t.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { category_id, amount, description, date, payment_method } = req.body;
  try {
    const queryText = `
      INSERT INTO transaksi (category_id, amount, description, date, payment_method)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [category_id, amount, description, date, payment_method];
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// BARIS SAKTI UNTUK VERCEL CLOUD
module.exports = app;

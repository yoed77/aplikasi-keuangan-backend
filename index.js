const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

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

// SESUAI FOTO SUPABASE: Menggunakan 'name' untuk urutan alfabet
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kategori ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SESUAI FOTO SUPABASE: Join menggunakan k.name dan k.type, serta t.date
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

// SESUAI FOTO SUPABASE: Input menggunakan nama kolom asli (amount, description, date, payment_method)
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

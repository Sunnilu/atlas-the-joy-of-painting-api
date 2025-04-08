const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Dalybred60',
  port: 5432,
});

// Helper: Format month from date
const getMonthName = (dateStr) => {
  return new Date(dateStr).toLocaleString('default', { month: 'long' });
};

// /episodes?color=&subject=&month=&match=all|any
app.get('/episodes', async (req, res) => {
  const { color, subject, month, match = 'all' } = req.query;

  try {
    console.log('Incoming query params:', req.query);

    let baseQuery = `
      SELECT e.id, e.title, e.air_date, e.season_number, e.episode_number,
        ARRAY_AGG(DISTINCT c.name) AS colors,
        ARRAY_AGG(DISTINCT s.name) AS subjects
      FROM episodes e
      LEFT JOIN episode_colors ec ON e.id = ec.episode_id
      LEFT JOIN colors c ON ec.color_id = c.id
      LEFT JOIN episode_subjects es ON e.id = es.episode_id
      LEFT JOIN subjects s ON es.subject_id = s.id
    `;
    const conditions = [];
    const values = [];

    if (month) {
      const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
      conditions.push(`EXTRACT(MONTH FROM e.air_date) = $${values.length + 1}`);
      values.push(monthIndex);
    }

    if (color) {
      const colors = Array.isArray(color) ? color : [color];
      const placeholders = colors.map((_, i) => `$${values.length + i + 1}`);
      conditions.push(`c.name IN (${placeholders.join(', ')})`);
      values.push(...colors);
    }

    if (subject) {
      const subjects = Array.isArray(subject) ? subject : [subject];
      const placeholders = subjects.map((_, i) => `$${values.length + i + 1}`);
      conditions.push(`s.name IN (${placeholders.join(', ')})`);
      values.push(...subjects);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${match === 'any' ? conditions.join(' OR ') : conditions.join(' AND ')}`;
    }

    baseQuery += ` GROUP BY e.id ORDER BY e.air_date ASC`;

    console.log('Final SQL Query:', baseQuery);
    console.log('Query Values:', values);

    console.log(baseQuery);
    console.log(values); 
    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// /filters — returns all available months, colors, subjects
app.get('/filters', async (req, res) => {
  try {
    const colorRes = await pool.query(`SELECT DISTINCT name FROM colors ORDER BY name`);
    const subjectRes = await pool.query(`SELECT DISTINCT name FROM subjects ORDER BY name`);
    const monthRes = await pool.query(`SELECT DISTINCT TO_CHAR(air_date, 'Month') AS month FROM episodes`);

    const formattedMonths = [
      ...new Set(
        monthRes.rows
          .map(r => r.month.trim())
          .filter(m => m.length > 0)
      )
    ];

    res.json({
      months: formattedMonths,
      colors: colorRes.rows.map(r => r.name),
      subjects: subjectRes.rows.map(r => r.name),
    });
  } catch (error) {
    console.error('Error loading filters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🎨 Joy of Painting API listening at http://localhost:${port}`);
});
const { Client } = require('pg');
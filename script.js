const { Client } = require('pg');

// PostgreSQL connection settings
const client = new Client({
  user: 'sunthalucas/Bob Ross',      // 
  database: 'The_joy_of_painting',  
  password: 'Dalybred60',  
  port: 5432,
});

// SQL schema to create your tables
const sql = `
-- Create main episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    air_date DATE NOT NULL,
    season_number INT,
    episode_number INT,
    description TEXT
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Colors table
CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Join table for episodes ↔ subjects
CREATE TABLE IF NOT EXISTS episode_subjects (
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, subject_id)
);

-- Join table for episodes ↔ colors
CREATE TABLE IF NOT EXISTS episode_colors (
    episode_id INT REFERENCES episodes(id) ON DELETE CASCADE,
    color_id INT REFERENCES colors(id) ON DELETE CASCADE,
    PRIMARY KEY (episode_id, color_id)
);
`;

async function runSQL() {
  try {
    await client.connect();
    await client.query(sql);
    console.log("✅ Database schema created successfully!");
  } catch (err) {
    console.error("❌ Error creating schema:", err);
  } finally {
    await client.end();
  }
}

runSQL();

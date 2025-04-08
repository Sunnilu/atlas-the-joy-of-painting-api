const fs = require('fs');
const { Client } = require('pg');

// PostgreSQL config
const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'joy_of_painting',
  password: 'your_password',
  port: 5432,
});

async function main() {
  await client.connect();

  // STEP 1: Load and parse the data files
  const rawEpisodes = JSON.parse(fs.readFileSync('./data/episodes.json', 'utf-8'));

  for (const ep of rawEpisodes) {
    // STEP 2: Normalize fields (e.g., trim strings, fix formatting)
    const title = ep.title.trim();
    const airDate = new Date(ep.air_date);
    const season = parseInt(ep.season);
    const episode = parseInt(ep.episode_number);
    const description = ep.description?.trim() ?? '';

    // STEP 3: Insert into episodes table
    const res = await client.query(
      `INSERT INTO episodes (title, air_date, season_number, episode_number, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, airDate, season, episode, description]
    );

    const episodeId = res.rows[0].id;

    // STEP 4: Handle subjects
    for (const subject of ep.subjects ?? []) {
      const clean = subject.trim().toLowerCase();
      const { rows } = await client.query(`SELECT id FROM subjects WHERE name = $1`, [clean]);
      const subjectId = rows[0]?.id ?? (
        await client.query(`INSERT INTO subjects (name) VALUES ($1) RETURNING id`, [clean])
      ).rows[0].id;

      await client.query(`INSERT INTO episode_subjects (episode_id, subject_id) VALUES ($1, $2)`, [episodeId, subjectId]);
    }

    // STEP 5: Handle colors
    for (const color of ep.colors ?? []) {
      const clean = color.trim().toLowerCase();
      const { rows } = await client.query(`SELECT id FROM colors WHERE name = $1`, [clean]);
      const colorId = rows[0]?.id ?? (
        await client.query(`INSERT INTO colors (name) VALUES ($1) RETURNING id`, [clean])
      ).rows[0].id;

      await client.query(`INSERT INTO episode_colors (episode_id, color_id) VALUES ($1, $2)`, [episodeId, colorId]);
    }
  }

  await client.end();
  console.log('✅ All data loaded successfully!');
}

main().catch(err => {
  console.error('❌ Error loading data:', err);
});

// script.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connect to PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Dalybred60',
  port: 5432,
});

async function seedDatabase() {
  try {
    await client.connect();

    // Load data from combined episodes JSON file (generated from parsed Excel sheets)
    const episodes = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/combined_episodes.json'), 'utf-8')
    );

    // === Insert episodes ===
    for (const ep of episodes) {
      await client.query(
        `INSERT INTO episodes (title, air_date, season_number, episode_number)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [ep.title, ep.air_date, ep.season_number, ep.episode_number]
      );
    }
    console.log('✅ Episodes inserted.');

    // === Insert colors ===
    const colorSet = new Set();
    episodes.forEach(ep => ep.colors.forEach(c => colorSet.add(c)));
    const colors = [...colorSet];
    for (const color of colors) {
      await client.query(`INSERT INTO colors (name) VALUES ($1) ON CONFLICT DO NOTHING`, [color]);
    }
    console.log('✅ Colors inserted.');

    // === Insert subjects ===
    const subjectSet = new Set();
    episodes.forEach(ep => ep.subjects.forEach(s => subjectSet.add(s)));
    const subjects = [...subjectSet];
    for (const subject of subjects) {
      await client.query(`INSERT INTO subjects (name) VALUES ($1) ON CONFLICT DO NOTHING`, [subject]);
    }
    console.log('✅ Subjects inserted.');

    // === Link episode_colors and episode_subjects ===
    const { rows: episodeRows } = await client.query(
      `SELECT id, title, season_number, episode_number FROM episodes`
    );
    const { rows: colorRows } = await client.query(`SELECT id, name FROM colors`);
    const { rows: subjectRows } = await client.query(`SELECT id, name FROM subjects`);

    const findEpisodeId = (title, season, episode) =>
      episodeRows.find(e =>
        e.title.toLowerCase() === title.toLowerCase() &&
        e.season_number === season &&
        e.episode_number === episode
      )?.id;

    const findColorId = name => colorRows.find(c => c.name.toLowerCase() === name.toLowerCase())?.id;
    const findSubjectId = name => subjectRows.find(s => s.name.toLowerCase() === name.toLowerCase())?.id;

    for (const ep of episodes) {
      const episodeId = findEpisodeId(ep.title, ep.season_number, ep.episode_number);
      if (!episodeId) continue;

      for (const color of ep.colors) {
        const colorId = findColorId(color);
        if (colorId) {
          await client.query(
            `INSERT INTO episode_colors (episode_id, color_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [episodeId, colorId]
          );
        }
      }

      for (const subject of ep.subjects) {
        const subjectId = findSubjectId(subject);
        if (subjectId) {
          await client.query(
            `INSERT INTO episode_subjects (episode_id, subject_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [episodeId, subjectId]
          );
        }
      }
    }
    console.log('✅ Episode-color and episode-subject links inserted.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seedDatabase();

const { Client } = require('pg');

// Database config
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Dalybred60',
  port: 5432,
});

const episodes = [
  { title: 'A Walk in the Woods', air_date: '1983-01-11', season_number: 1, episode_number: 1 },
  { title: 'Mount McKinley', air_date: '1983-01-11', season_number: 1, episode_number: 2 },
  { title: 'Ebony Sunset', air_date: '1983-01-18', season_number: 1, episode_number: 3 },
  { title: 'Winter Mist', air_date: '1983-01-25', season_number: 1, episode_number: 4 },
  { title: 'Quiet Stream', air_date: '1983-02-01', season_number: 1, episode_number: 5 },
  // Add the rest of the parsed data here or import it from a JSON file if it's large
];

async function insertEpisodes() {
  try {
    await client.connect();

    for (const ep of episodes) {
      await client.query(
        `INSERT INTO episodes (title, air_date, season_number, episode_number)
         VALUES ($1, $2, $3, $4)`,
        [ep.title, ep.air_date, ep.season_number, ep.episode_number]
      );
    }

    console.log('✅ Episodes inserted successfully.');
  } catch (err) {
    console.error('❌ Error inserting episodes:', err);
  } finally {
    await client.end();
  }
}

insertEpisodes();

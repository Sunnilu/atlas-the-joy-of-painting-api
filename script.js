const { Client } = require('pg');

// Database config
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Dalybred60',
  port: 5432,
});
// Connect to the database

// Parsed data (replace with file reading logic if needed)
const episodes = [
  { title: 'A Walk in the Woods', air_date: '1983-01-11', season_number: 1, episode_number: 1 },
  { title: 'Mount McKinley', air_date: '1983-01-11', season_number: 1, episode_number: 2 },
  { title: 'Ebony Sunset', air_date: '1983-01-18', season_number: 1, episode_number: 3 },
  { title: 'Winter Mist', air_date: '1983-01-25', season_number: 1, episode_number: 4 },
  { title: 'Quiet Stream', air_date: '1983-02-01', season_number: 1, episode_number: 5 }
];

const colors = [
  'Alizarin Crimson', 'Black Gesso', 'Bright Red', 'Burnt Umber', 'Cadmium Yellow',
  'Dark Sienna', 'Indian Red', 'Indian Yellow', 'Liquid Black', 'Liquid Clear',
  'Midnight Black', 'Phthalo Blue', 'Phthalo Green', 'Prussian Blue', 'Sap Green',
  'Titanium White', 'Van Dyke Brown', 'Yellow Ochre'
];

const episodeColorMappings = [
  { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Alizarin Crimson' },
  { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Bright Red' },
  { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Cadmium Yellow' },
  // Add all mappings from parsed CSV here
];

async function seedDatabase() {
  try {
    await client.connect();

    // Insert episodes
    for (const ep of episodes) {
      await client.query(
        `INSERT INTO episodes (title, air_date, season_number, episode_number)
         VALUES ($1, $2, $3, $4)`,
        [ep.title, ep.air_date, ep.season_number, ep.episode_number]
      );
    }
    console.log('✅ Episodes inserted.');

    // Insert colors
    for (const color of colors) {
      await client.query(`INSERT INTO colors (name) VALUES ($1) ON CONFLICT DO NOTHING`, [color]);
    }
    console.log('✅ Colors inserted.');

    // Fetch episode and color IDs
    const { rows: episodeRows } = await client.query(`SELECT id, title, season_number, episode_number FROM episodes`);
    const { rows: colorRows } = await client.query(`SELECT id, name FROM colors`);

    const findEpisodeId = (title, season, ep) =>
      episodeRows.find(e => e.title === title && e.season_number === season && e.episode_number === ep)?.id;

    const findColorId = name =>
      colorRows.find(c => c.name === name)?.id;

    // Insert episode_colors links
    for (const map of episodeColorMappings) {
      const episodeId = findEpisodeId(map.title, map.season, map.episode);
      const colorId = findColorId(map.color);

      if (episodeId && colorId) {
        await client.query(
          `INSERT INTO episode_colors (episode_id, color_id) VALUES ($1, $2)`,
          [episodeId, colorId]
        );
      }
    }

    console.log('✅ Episode-color links inserted.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seedDatabase();

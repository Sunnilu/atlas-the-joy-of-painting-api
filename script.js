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

// === Episodes ===
const episodes = [
    { title: 'A Walk in the Woods', air_date: '1983-01-11', season_number: 1, episode_number: 1 },
    { title: 'Mount McKinley', air_date: '1983-01-11', season_number: 1, episode_number: 2 },
    { title: 'Ebony Sunset', air_date: '1983-01-18', season_number: 1, episode_number: 3 },
    { title: 'Winter Mist', air_date: '1983-01-25', season_number: 1, episode_number: 4 },
    { title: 'Quiet Stream', air_date: '1983-02-01', season_number: 1, episode_number: 5 }
  ];
  
  // === Colors ===
  const colors = [
    'Alizarin Crimson', 'Black Gesso', 'Bright Red', 'Burnt Umber', 'Cadmium Yellow',
    'Dark Sienna', 'Indian Red', 'Indian Yellow', 'Liquid Black', 'Liquid Clear',
    'Midnight Black', 'Phthalo Blue', 'Phthalo Green', 'Prussian Blue', 'Sap Green',
    'Titanium White', 'Van Dyke Brown', 'Yellow Ochre'
  ];
  
  const episodeColorMappings = [
    { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Alizarin Crimson' },
    { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Bright Red' },
    { title: 'A Walk in the Woods', season: 1, episode: 1, color: 'Cadmium Yellow' }
  ];
  
  // === Subjects ===
  const subjects = [
    'Tree', 'River', 'Mountain', 'Cabin', 'Waterfall', 'Ocean', 'Snow', 'Barn', 'Lake', 'Winter'
  ];
  
  const episodeSubjectMappings = [
    { title: 'A Walk In The Woods', season: 1, episode: 1, subject: 'Tree' },
    { title: 'A Walk In The Woods', season: 1, episode: 1, subject: 'Lake' },
    { title: 'Mount McKinley', season: 1, episode: 2, subject: 'Mountain' },
    { title: 'Winter Mist', season: 1, episode: 4, subject: 'Snow' },
    { title: 'Quiet Stream', season: 1, episode: 5, subject: 'River' }
  ];
  
  async function seedDatabase() {
    try {
      await client.connect();
  
      // Insert episodes
      for (const ep of episodes) {
        await client.query(
          `INSERT INTO episodes (title, air_date, season_number, episode_number)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [ep.title, ep.air_date, ep.season_number, ep.episode_number]
        );
      }
      console.log('✅ Episodes inserted.');
  
      // Insert colors
      for (const color of colors) {
        await client.query(`INSERT INTO colors (name) VALUES ($1) ON CONFLICT DO NOTHING`, [color]);
      }
      console.log('✅ Colors inserted.');
  
      // Insert subjects
      for (const subject of subjects) {
        await client.query(`INSERT INTO subjects (name) VALUES ($1) ON CONFLICT DO NOTHING`, [subject]);
      }
      console.log('✅ Subjects inserted.');
  
      // Fetch IDs
      const { rows: episodeRows } = await client.query(`SELECT id, title, season_number, episode_number FROM episodes`);
      const { rows: colorRows } = await client.query(`SELECT id, name FROM colors`);
      const { rows: subjectRows } = await client.query(`SELECT id, name FROM subjects`);
  
      const findEpisodeId = (title, season, ep) =>
        episodeRows.find(e => e.title.toLowerCase() === title.toLowerCase() && e.season_number === season && e.episode_number === ep)?.id;
  
      const findColorId = name =>
        colorRows.find(c => c.name.toLowerCase() === name.toLowerCase())?.id;
  
      const findSubjectId = name =>
        subjectRows.find(s => s.name.toLowerCase() === name.toLowerCase())?.id;
  
      // Insert episode_colors links
      for (const map of episodeColorMappings) {
        const episodeId = findEpisodeId(map.title, map.season, map.episode);
        const colorId = findColorId(map.color);
        if (episodeId && colorId) {
          await client.query(
            `INSERT INTO episode_colors (episode_id, color_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [episodeId, colorId]
          );
        }
      }
      console.log('✅ Episode-color links inserted.');
  
      // Insert episode_subjects links
      for (const map of episodeSubjectMappings) {
        const episodeId = findEpisodeId(map.title, map.season, map.episode);
        const subjectId = findSubjectId(map.subject);
        if (episodeId && subjectId) {
          await client.query(
            `INSERT INTO episode_subjects (episode_id, subject_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [episodeId, subjectId]
          );
        }
      }
      console.log('✅ Episode-subject links inserted.');
  
    } catch (err) {
      console.error('❌ Error seeding database:', err);
    } finally {
      await client.end();
    }
  }
  
  seedDatabase();

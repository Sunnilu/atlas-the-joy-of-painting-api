const { Client } = require('pg');
const fs = require('fs');

// Load SQL from file (or define it as a string here)
const sql = fs.readFileSync('./schema.sql', 'utf-8'); // OR paste schema directly here

const client = new Client({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

client.connect();

client.query(sql, (err, res) => {
  if (err) {
    console.error('Error executing SQL:', err.stack);
  } else {
    console.log('Database schema created!');
  }
  client.end();
});

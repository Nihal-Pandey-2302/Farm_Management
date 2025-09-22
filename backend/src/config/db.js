const { Pool } = require('pg');

// Create a new connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export a query function to be used throughout the application
module.exports = {
  query: (text, params) => pool.query(text, params),
};
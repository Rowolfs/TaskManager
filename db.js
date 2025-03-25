const { Pool } = require('pg'); // импортируем Pool из библиотеки pg
require('dotenv').config(); // подключаем dotenv для работы с переменными окружения

// создаём новый пул подключений
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function createTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS your_table_name (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      description TEXT
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table created or already exists.');
  } catch (err) {
    console.error('Error creating table:', err.stack);
  }
}

createTableIfNotExists();

module.exports = pool;

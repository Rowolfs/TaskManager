const { Pool } = require('pg'); // импортируем Pool из библиотеки pg
require('dotenv').config(); // подключаем dotenv для работы с переменными окружения

// создаём новый пул подключений
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool;

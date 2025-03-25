const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const os = require('os');
// Middleware
app.use(cors());
app.use(express.json());


// 📌 [GET] Получение всех задач
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении задач:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 📌 [POST] Добавление задачи
app.post('/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        console.log(req.body);
        const result = await pool.query(
            'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, false) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 📌 [PUT] Обновление состояния задачи
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params.id;
        console.log(id)
        /////
        const {title} = req.body
        const {description} = req.body
        const { completed } = req.body;
        const taskId = parseInt(id, 10); 

        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Некорректный ID' });
        }

        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title,description,completed, taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// 📌 [DELETE] Удаление задачи
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Задача удалена' });
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Ищем IPv4, который не является внутренним (не 127.0.0.1)
        if(iface.address === '172.21.80.87'){
            return 'localhost';
        }
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    
    return 'localhost';
  }

// Запуск сервера
app.listen(PORT,'0.0.0.0', () => {
    console.log(`✅ Сервер запущен на http://89.169.13.184:${PORT}`);
});

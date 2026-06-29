require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- ВАЖНЫЕ НАСТРОЙКИ (Middleware) ---
app.use(cors());
app.use(express.json());

// Раздача статических файлов из папки 'public'
app.use(express.static('public'));

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Успешное подключение к MongoDB!'))
  .catch((err) => console.error('Ошибка подключения к БД:', err));

// --- МАРШРУТЫ (Routes) ---
const authRoutes = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

// Используем абсолютный путь к папке public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateAuth } = require('../middleware/validate'); // Импортируем проверку
const auth = require('../middleware/authMiddleware'); // Подключаем защиту

// Маршрут регистрации с валидацией
router.post('/register', validateAuth, authController.register); 

// Маршрут логина
router.post('/login', authController.login);

// Защищенный маршрут для получения профиля
router.get('/profile', auth, authController.getProfile); 

module.exports = router;
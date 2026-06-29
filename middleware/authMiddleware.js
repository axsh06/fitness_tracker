const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Получаем токен из заголовков
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Нет доступа, токен не предоставлен' });

  try {
    // Расшифровываем токен
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // Добавляем данные пользователя в запрос
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};
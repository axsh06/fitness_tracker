const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Регистрация нового пользователя
exports.register = async (req, res) => {
  try {
    const { name, email, password, targetWeight } = req.body;

    // Проверяем, есть ли уже такой email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль (защита данных)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем пользователя
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      targetWeight
    });

    await newUser.save();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при регистрации', error });
  }
};

// Вход в систему (Логин)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Сравниваем введенный пароль с захешированным в базе
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Создаем JWT токен (билет для доступа к защищенным маршрутам)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при логине', error });
  }
};
// Получение профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении профиля', error });
  }
};
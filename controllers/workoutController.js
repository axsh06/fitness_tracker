const Workout = require('../models/Workout');

// Создание тренировки (POST)
exports.createWorkout = async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user_id: req.user.id });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании тренировки', error });
  }
};

// Получение всех тренировок с пагинацией, фильтром и поиском (GET)
exports.getWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { user_id: req.user.id };
    
    // Фильтрация по статусу
    if (status) query.status = status;

    // Поиск по ключевому слову (название упражнения)
    if (search) {
      query.exerciseName = { $regex: search, $options: 'i' };
    }

    const workouts = await Workout.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Workout.countDocuments(query);
    res.status(200).json({ 
      workouts, 
      totalPages: Math.ceil(count / limit), 
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении тренировок', error });
  }
};

// Обновление тренировки (PUT)
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
        { _id: req.params.id, user_id: req.user.id }, 
        req.body, 
        { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Тренировка не найдена' });
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении', error });
  }
};

// Удаление тренировки (DELETE)
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!workout) return res.status(404).json({ message: 'Тренировка не найдена' });
    res.status(200).json({ message: 'Тренировка успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении', error });
  }
};
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Связь с пользователем
  foodItem: { type: String, required: true }, // Отлично подойдет для логирования порций курицы, яиц и гречки
  proteinGrams: { type: Number, required: true },
  calories: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
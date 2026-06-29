const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Связь с пользователем
  exerciseName: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  status: { type: String, enum: ['planned', 'completed'], default: 'planned' }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
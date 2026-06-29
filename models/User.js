const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  targetWeight: { type: Number, default: 80 } // Удобно для отслеживания прогресса набора массы
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  color: { type: String, default: '#6366f1' },
  status: { type: String, enum: ['ativo', 'pausado', 'concluido'], default: 'ativo' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['pendente', 'em_andamento', 'concluida'], default: 'pendente' },
  priority: { type: String, enum: ['baixa', 'media', 'alta'], default: 'media' },
  dueDate: { type: Date, default: null },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

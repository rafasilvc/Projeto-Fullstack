const Task = require('../models/Task');
const Project = require('../models/Project');

exports.create = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Título e projeto são obrigatórios.' });
    const proj = await Project.findOne({ _id: project, owner: req.user._id });
    if (!proj) return res.status(404).json({ message: 'Projeto não encontrado.' });
    const task = await Task.create({ title, description, status, priority, dueDate: dueDate || null, project, owner: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.project) filter.project = req.query.project;
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).populate('project', 'name color').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate('project', 'name color');
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, description, status, priority, dueDate: dueDate || null },
      { new: true, runValidators: true }
    ).populate('project', 'name color');
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json({ message: 'Tarefa removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Project = require('../models/Project');

exports.create = async (req, res) => {
  try {
    const { name, description, color, status } = req.body;
    if (!name || !description) return res.status(400).json({ message: 'Nome e descrição são obrigatórios.' });
    const project = await Project.create({ name, description, color, status, owner: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, color, status } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name, description, color, status },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });
    res.json({ message: 'Projeto removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

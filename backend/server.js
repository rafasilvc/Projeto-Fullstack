require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve frontend estático
app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API funcionando com sucesso.' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

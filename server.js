const express = require('express');
const path = require('path');
const app = express();

// Middleware para JSON
app.use(express.json());

// API de ejemplo
let botellas = []; // puedes reemplazar con lógica real o base de datos
app.get('/api/botellas', (req, res) => res.json(botellas));

app.post('/api/botellas', (req, res) => {
  const nuevaBotella = { ...req.body, id: botellas.length + 1 };
  botellas.push(nuevaBotella);
  res.json(nuevaBotella);
});

app.put('/api/botellas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = botellas.findIndex(b => b.id === id);
  if (index !== -1) {
    botellas[index] = { ...req.body, id };
    res.json(botellas[index]);
  } else {
    res.status(404).json({ error: 'No encontrada' });
  }
});

app.delete('/api/botellas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  botellas = botellas.filter(b => b.id !== id);
  res.json({ ok: true });
});

// Servir Angular
app.use(express.static(path.join(__dirname, 'dist/botellas_mesas')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/botellas_mesas/index.html'));
});

// Favicon vacío para evitar errores 502
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Puerto dinámico para Railway
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));

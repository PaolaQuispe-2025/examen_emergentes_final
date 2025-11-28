const express = require('express');
const path = require('path');

const app = express();

// Servir archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist/botellas-mesas/browser')));

// Todas las rutas deben servir el index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/botellas-mesas/browser/index.html'));
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
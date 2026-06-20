// Archivo principal de servidor

const express = require('express');
const cors = require('cors');

// Importar los controladores
const { registrarCliente, obtenerClientes } = require('./controllers/clienteController');
const { registrarChecada, obtenerAsistencias } = require('./controllers/asistenciaControllers');

const app = express();
const PORT = 5000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Soporta fotos en Base64

// ---- RUTAS DE LA API ----

// Autenticación simulada del Admin
app.post('/api/auth/login', (req, res) => {
    const { adminPassword } = req.body;
    if (adminPassword === "admin123") {
        return res.status(200).json({ success: true });
    }
    res.status(401).json({ error: "Contraseña incorrecta." });
});

// Rutas de Clientes
app.post('/api/clientes', registrarCliente);
app.get('/api/clientes', obtenerClientes);

// Rutas de Asistencias
app.post('/api/asistencia/checar', registrarChecada);
app.get('/api/asistencia', obtenerAsistencias);

// Arrancar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor del gimnasio listo en http://localhost:${PORT}`);
});
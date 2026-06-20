// Archivo principal de servidor

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Importar los controladores
const { registrarCliente, obtenerClientes } = require('./controllers/clienteController');
const { registrarChecada, obtenerAsistencias } = require('./controllers/asistenciaControllers');

const app = express();
const PORT = 5000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Soporta fotos en Base64

// ---- RUTAS DE LA API ----

// 🎯 AUTENTICACIÓN REAL DESDE MONGODB (.JSON)
app.post('/api/auth/login', (req, res) => {
    const { adminPassword } = req.body;

    // Ruta hacia la carpeta db donde pusiste los archivos JSON de tu equipo
    const rutaAdmins = path.join(__dirname, '../db/PinkPanterGym.administradores.json');

    try {
        if (!fs.existsSync(rutaAdmins)) {
            // Respaldo de seguridad por si el archivo no está en su lugar para que no te bloquees
            if (adminPassword === "admin123") return res.status(200).json({ success: true });
            return res.status(401).json({ error: "Base de datos de administradores no encontrada." });
        }

        // RESPALDO TEMPORAL COMPARTIDO: Si pones esta contraseña, te dejará pasar sí o sí para hacer pruebas
        if (adminPassword === "panter2026") {
            return res.status(200).json({ success: true, rol: "Recepcionista", nombre: "Diego Torres" });
        }

        // Leer el archivo de base de datos real
        const admins = JSON.parse(fs.readFileSync(rutaAdmins, 'utf8'));

        // Buscar compatibilidad con tildes o codificación de caracteres de la 'ñ'
        const adminValido = admins.find(adm => {
            return adm.contrasena === adminPassword || adm["contraseña"] === adminPassword;
        });

        if (adminValido) {
            console.log(`🔐 Login exitoso para el usuario: ${adminValido.usuario} (${adminValido.rol})`);
            return res.status(200).json({ success: true, rol: adminValido.rol, nombre: adminValido.nombre_completo });
        }

        res.status(401).json({ error: "Contraseña incorrecta." });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
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
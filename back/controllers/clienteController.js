// archivo controlador de clientes

// Base de datos simulada en memoria
let clientesBD = [];

// Registrar un nuevo cliente
const registrarCliente = (req, res) => {
    const { id, nombre, edad, correo, emergencia, foto } = req.body;

    if (!id || !nombre || !edad || !correo || !emergencia) {
        return res.status(400).json({ error: "Por favor, completa todos los campos obligatorios." });
    }

    const existe = clientesBD.find(c => c.id === id);
    if (existe) {
        return res.status(400).json({ error: "El ID generado ya existe." });
    }

    const nuevoCliente = {
        id,
        nombre,
        edad: parseInt(edad),
        correo,
        emergencia,
        foto: foto || null,
        fechaRegistro: new Date()
    };

    clientesBD.push(nuevoCliente);
    res.status(201).json({ mensaje: "Cliente registrado con éxito.", cliente: nuevoCliente });
};

// Obtener todos los clientes (para pruebas)
const obtenerClientes = (req, res) => {
    res.json(clientesBD);
};

// Exportamos las funciones y la BD temporal para que el controlador de asistencia pueda leerla
module.exports = { registrarCliente, obtenerClientes, clientesBD };
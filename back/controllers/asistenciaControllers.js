// Archivo de control de asistencia

// Importamos la lista de clientes para validar que existan
const { clientesBD } = require('./clienteController');

let asistenciasBD = [];

const registrarChecada = (req, res) => {
    const { idInput } = req.body;

    if (!idInput) {
        return res.status(400).json({ error: "El ID es obligatorio." });
    }

    // 1. Validar si el cliente existe en nuestro registro
    const cliente = clientesBD.find(c => c.id === idInput.toUpperCase().trim());
    if (!cliente) {
        return res.status(404).json({ error: "El ID no corresponde a ningún cliente registrado." });
    }

    // 2. Determinar dinámicamente si es Entrada o Salida
    const historialCliente = asistenciasBD.filter(a => a.idCliente === cliente.id);
    let proximoMovimiento = "ENTRADA";

    if (historialCliente.length > 0) {
        const ultimoRegistro = historialCliente[historialCliente.length - 1];
        proximoMovimiento = ultimoRegistro.tipo === "ENTRADA" ? "SALIDA" : "ENTRADA";
    }

    // 3. Guardar asistencia
    const nuevaAsistencia = {
        idCliente: cliente.id,
        nombreCliente: cliente.nombre,
        tipo: proximoMovimiento,
        timestamp: new Date()
    };

    asistenciasBD.push(nuevaAsistencia);

    res.status(200).json({
        mensaje: `Registro de ${proximoMovimiento} exitoso.`,
        cliente: {
            id: cliente.id,
            nombre: cliente.nombre,
            tipoMovimiento: proximoMovimiento,
            hora: nuevaAsistencia.timestamp.toLocaleString('es-MX')
        }
    });
};

const obtenerAsistencias = (req, res) => {
    res.json(asistenciasBD);
};

module.exports = { registrarChecada, obtenerAsistencias };
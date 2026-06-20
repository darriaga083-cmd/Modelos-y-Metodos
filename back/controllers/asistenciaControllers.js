// Archivo de control de asistencia

const fs = require('fs');
const path = require('path');
const clienteController = require('./clienteController');

const rutaAsistencias = path.join(__dirname, '../../db/PinkPanterGym.historial_accesos.json');

function leerAsistencias() {
  if (!fs.existsSync(rutaAsistencias)) return [];
  try {
    return JSON.parse(fs.readFileSync(rutaAsistencias, 'utf8'));
  } catch (e) { return []; }
}

function guardarAsistencias(data) {
  fs.writeFileSync(rutaAsistencias, JSON.stringify(data, null, 2), 'utf8');
}

const registrarChecada = (req, res) => {
  const { idInput } = req.body;

  if (!idInput) {
    return res.status(400).json({ error: "El ID es obligatorio." });
  }

  // 🎯 Obtenemos los clientes directo de la persistencia del archivo JSON
  const clientesBD = clienteController.clientesBD;
  
  const cliente = clientesBD.find(c => 
    (c.id_socio && c.id_socio.toUpperCase().trim() === idInput.toUpperCase().trim()) || 
    (c.id && c.id.toUpperCase().trim() === idInput.toUpperCase().trim())
  );

  if (!cliente) {
    return res.status(404).json({ error: "El ID no corresponde a ningún cliente registrado." });
  }

  const asistenciasBD = leerAsistencias();
  const historialCliente = asistenciasBD.filter(a => a.id_socio === (cliente.id_socio || cliente.id));
  let proximoMovimiento = "Entrada";

  if (historialCliente.length > 0) {
    const ultimoRegistro = historialCliente[historialCliente.length - 1];
    proximoMovimiento = ultimoRegistro.tipo_movimiento === "Entrada" ? "Salida" : "Entrada";
  }

  const nuevaAsistencia = {
    id_socio: cliente.id_socio || cliente.id,
    nombre_completo: cliente.nombre_apellidos || cliente.nombre,
    fecha_hora: new Date().toISOString(),
    tipo_movimiento: proximoMovimiento
  };

  asistenciasBD.push(nuevaAsistencia);
  guardarAsistencias(asistenciasBD); // 💾 Persistido en el JSON de asistencias

  res.status(200).json({
    mensaje: `¡${proximoMovimiento} registrada con éxito!`,
    asistencia: nuevaAsistencia
  });
};

const obtenerAsistencias = (req, res) => {
  res.json(leerAsistencias());
};

module.exports = { registrarChecada, obtenerAsistencias };
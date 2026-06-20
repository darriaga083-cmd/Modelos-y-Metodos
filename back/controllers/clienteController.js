// archivo controlador de clientes

const fs = require('fs');
const path = require('path');

// Ruta exacta hacia el archivo JSON de miembros en la carpeta db
const rutaBD = path.join(__dirname, '../../db/PinkPanterGym.miembros.json');

// Función auxiliar para leer los clientes desde el archivo JSON
function leerClientesDeArchivo() {
  try {
    if (!fs.existsSync(rutaBD)) {
      return []; // Si el archivo no existe aún, devolvemos un arreglo vacío
    }
    const datosRaw = fs.readFileSync(rutaBD, 'utf8');
    return JSON.parse(datosRaw);
  } catch (error) {
    console.error("Error al leer la base de datos JSON:", error);
    return [];
  }
}

// Función auxiliar para guardar los clientes en el archivo JSON
function guardarClientesEnArchivo(clientes) {
  try {
    fs.writeFileSync(rutaBD, JSON.stringify(clientes, null, 2), 'utf8');
  } catch (error) {
    console.error("Error al escribir en la base de datos JSON:", error);
  }
}

// Registrar un nuevo cliente
const registrarCliente = (req, res) => {
  const { id, nombre, edad, correo, emergencia, foto } = req.body;

  if (!id || !nombre || !edad || !correo || !emergencia) {
    return res.status(400).json({ error: "Por favor, completa todos los campos obligatorios." });
  }

  // Cargar los clientes actuales desde el archivo JSON
  const clientesBD = leerClientesDeArchivo();

  const existe = clientesBD.find(c => c.id_socio === id || c.id === id);
  if (existe) {
    return res.status(400).json({ error: "El ID generado ya existe." });
  }

  const nuevoCliente = {
    id_socio: id, // Mantenemos la estructura compatible de tu base de datos
    id: id,       // Mantenemos compatibilidad con el frontend anterior
    nombre_apellidos: nombre,
    nombre: nombre,
    edad: parseInt(edad),
    correo_electronico: correo,
    correo: correo,
    numero_emergencia: emergencia,
    foto_identificacion: foto || null,
    foto: foto || null,
    fecha_registro: new Date().toISOString(),
    fechaRegistro: new Date(),
    membresia_actual: {
      plan: "Mensual",
      estado: "Al día",
      proximo_pago: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días después
    }
  };

  clientesBD.push(nuevoCliente);
  guardarClientesEnArchivo(clientesBD); // 💾 Guardado físico permanente

  res.status(201).json({ mensaje: "Cliente registrado con éxito.", cliente: nuevoCliente });
};

// Obtener todos los clientes (Modificado para leer del JSON)
const obtenerClientes = (req, res) => {
  const clientesBD = leerClientesDeArchivo();
  res.json(clientesBD);
};

// Exportamos las funciones y la lógica persistente
module.exports = { 
  registrarCliente, 
  obtenerClientes,
  get clientesBD() { return leerClientesDeArchivo(); } // Getter para que asistencia pueda leerlo actualizado
};
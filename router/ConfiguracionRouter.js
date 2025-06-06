// Configuración de rutas en el backend
const express = require('express');
const router = express.Router();

// Ruta para obtener las opciones de personalización
router.get('/configuracion/personalizacion', (req, res) => {
  const funcionesDePersonalizacion = [
    "Cambiar tema visual del sistema",
    "Configurar la apariencia del inventario",
    "Personalizar la tienda online",
    "Subir logo y personalización de marca",
    "Configurar idioma y localización",
    "Definir alertas visuales por estado del inventario"
    
  ];

  res.json({ success: true, funciones: funcionesDePersonalizacion });
});

// Funciones que se ejecutarán al hacer clic en las opciones
function cambiarTema() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Cambiar Tema Visual del Sistema</h3><p>Aquí puedes cambiar los temas visuales del sistema.</p>';
}

function configurarInventario() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Configurar Apariencia del Inventario</h3><p>Aquí puedes configurar la apariencia visual del inventario.</p>';
}

function personalizarTienda() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Personalizar la Tienda Online</h3><p>Aquí puedes personalizar los elementos visuales de tu tienda online.</p>';
}

function subirLogo() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Subir Logo y Personalización de Marca</h3><p>Aquí puedes subir tu logo y personalizar tu marca.</p>';
}

function configurarIdioma() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Configurar Idioma y Localización</h3><p>Aquí puedes configurar el idioma y la localización de tu tienda o sistema.</p>';
}

function definirAlertas() {
  document.getElementById('contenido-seleccionado').innerHTML = '<h3>Definir Alertas Visuales por Estado del Inventario</h3><p>Aquí puedes definir las alertas visuales para el estado del inventario.</p>';
}

// Asignar los eventos de clic a las opciones del menú
document.getElementById('cambiar-tema').addEventListener('click', cambiarTema);
document.getElementById('configurar-inventario').addEventListener('click', configurarInventario);
document.getElementById('personalizar-tienda').addEventListener('click', personalizarTienda);
document.getElementById('subir-logo').addEventListener('click', subirLogo);
document.getElementById('configurar-idioma').addEventListener('click', configurarIdioma);
document.getElementById('definir-alertas').addEventListener('click', definirAlertas);



/*____________________________SEGURIDAD Y CONTRASEÑA________________________________________________*/
// Variable dentro del router
let politicaSeguridad = {
  longitud_minima: 8,
  requiere_especial: false,
  requiere_mayusculas: false
};

router.get('/seguridad', (req, res) => {
  res.json(politicaSeguridad);
});

router.post('/seguridad', (req, res) => {
  const { longitud_minima, requiere_especial, requiere_mayusculas } = req.body;
  politicaSeguridad = {
      longitud_minima,
      requiere_especial,
      requiere_mayusculas
  };
  res.status(200).json(politicaSeguridad);
});









module.exports = router;

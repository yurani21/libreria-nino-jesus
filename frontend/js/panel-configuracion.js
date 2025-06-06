const API_BASE = 'http://localhost:3000';

// ===== FUNCIONES GLOBALES =====

function mostrarSeccion(id) {
  const secciones = [
    'gestion-administradores',
    'personalizacion',
    'respaldos',
    'seguridad',
    'config-apariencia',
    'config-tienda',
    'config-marca',
    'config-idioma'
  ];

  // Ocultar todas las secciones
  secciones.forEach(seccionId => {
    const elemento = document.getElementById(seccionId);
    if (elemento) {
      elemento.classList.add('hidden');
    }
  });

  // Mostrar solo la que corresponde
  const activa = document.getElementById(id);
  if (activa) {
    activa.classList.remove('hidden');
  } else {
    console.warn(`No se encontró el elemento con id: ${id}`);
  }

   // Si es la sección de seguridad, cargar los datos
   if (id === 'seguridad') {
    cargarAdministradoresSeguridad();
  }
}

function volverAConfiguracion() {
  ocultarTodasLasSecciones(); // Oculta todas las secciones primero
  const config = document.getElementById('configuracion');
  if (config) config.classList.remove('hidden');
}



function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
  let cont = document.getElementById('notificacion-container');
  if (!cont) {
    cont = document.createElement('div');
    cont.id = 'notificacion-container';
    cont.style.position = 'fixed';
    cont.style.top = '10px';
    cont.style.right = '10px';
    cont.style.zIndex = '9999';
    document.body.appendChild(cont);
  }

  const notif = document.createElement('div');
  notif.textContent = mensaje;
  notif.style.background = tipo === 'error' ? '#e74c3c' : (tipo === 'success' ? '#2ecc71' : '#3498db');
  notif.style.color = '#fff';
  notif.style.padding = '10px 15px';
  notif.style.marginTop = '10px';
  notif.style.borderRadius = '4px';
  notif.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  notif.style.fontFamily = 'Arial, sans-serif';
  notif.style.cursor = 'pointer';

  notif.onclick = () => notif.remove();
  cont.appendChild(notif);

  setTimeout(() => notif.remove(), duracion);
}

// ===== CARGAR FUNCIONALIDADES =====
document.addEventListener("DOMContentLoaded", () => {
  const btnVerPersonalizacion = document.getElementById("btn-ver-personalizacion");
  const seccionPersonalizacion = document.getElementById("personalizacion");
  const seccionConfiguracion = document.getElementById("configuracion");
  const contenedor = document.getElementById("funciones-personalizacion");
  const btnVolver = document.getElementById("btnVolverConfig");

  const opcionesPersonalizacion = [
    { titulo: "Configurar Apariencia del Inventario", descripcion: "Ajusta colores, fuentes y disposición del inventario.", funcion: mostrarApariencia },
    { titulo: "Personalizar Tienda Online", descripcion: "Define el estilo visual y layout de la tienda.", funcion: mostrarTienda },
    { titulo: "Subir Logo o Marca", descripcion: "Carga tu logo y selecciona colores corporativos.", funcion: mostrarLogo },
    { titulo: "Configurar Idioma y Localización", descripcion: "Selecciona idioma predeterminado y ubicación geográfica.", funcion: mostrarIdioma }
  ];

  btnVerPersonalizacion.addEventListener("click", () => {
    seccionConfiguracion.classList.add("hidden");
    seccionPersonalizacion.classList.remove("hidden");
    contenedor.innerHTML = "";

    opcionesPersonalizacion.forEach(opcion => {
      const card = document.createElement("div");
      card.className = "bg-white p-4 rounded shadow";
      card.innerHTML = `
        <h4 class="text-lg font-semibold mb-2">${opcion.titulo}</h4>
        <p class="text-gray-600 mb-4">${opcion.descripcion}</p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Ejecutar</button>
      `;
      card.querySelector("button").addEventListener("click", opcion.funcion);
      contenedor.appendChild(card);
    });
  });

  btnVolver.addEventListener("click", () => {
    seccionPersonalizacion.classList.add("hidden");
    seccionConfiguracion.classList.remove("hidden");
  });

  // Mostrar previsualización de logo
  const inputLogo = document.getElementById('logoPrincipal');
  if (inputLogo) {
    inputLogo.addEventListener('change', function () {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById('previewLogo');
        if (img) {
          img.src = e.target.result;
          img.style.display = 'block';
        }
      };
      reader.readAsDataURL(this.files[0]);
    });
  }

  // ===== Formulario Apariencia =====
  const formApariencia = document.getElementById('formApariencia');
  if (formApariencia) {
    formApariencia.addEventListener('submit', async function (e) {
      e.preventDefault();

      const datos = {
        fondo: document.getElementById('fondoColor').value,
        texto: document.getElementById('textoColor').value,
        boton: document.getElementById('botonColor').value,
        fuente: document.getElementById('fuenteLetra').value,
      };

      const res = await fetch('/api/personalizacion/apariencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await res.json();
      alert(result.mensaje);
    });
  }

// Oculta todas las subsecciones antes de mostrar otra
function ocultarTodasLasSubsecciones() {
  document.querySelectorAll('.subseccion').forEach(div => div.classList.add('hidden'));
}

// Oculta todas las subsecciones antes de mostrar otra
function ocultarTodasLasSubsecciones() {
  document.querySelectorAll('.subseccion').forEach(div => div.classList.add('hidden'));
}

// Muestra la sección de personalización de tienda
async function mostrarTienda() {
  ocultarTodasLasSubsecciones();
  document.getElementById("configuracionTienda").classList.remove("hidden");
  await cargarConfiguracionTienda(); // Llama a la función para precargar los datos
}

// Carga configuración actual desde el backend
async function cargarConfiguracionTienda() {
  try {
    const res = await fetch('http://localhost:3000/api/personalizacion/tienda');
    if (!res.ok) throw new Error('Error al obtener configuración');

    const config = await res.json();

    document.getElementById('textoBienvenida').value = config.bienvenida || '';
    document.getElementById('mostrarBanners').value = config.banners || 'si';
    document.getElementById('colorFondo').value = config.fondo || '#ffffff';
    document.getElementById('colorTexto').value = config.texto || '#000000';
  } catch (error) {
    console.error('Error cargando configuración tienda:', error);
    alert('No se pudo cargar la configuración de la tienda.');
  }
}

// Envía la nueva configuración al servidor
async function guardarConfiguracionTienda() {
  const data = {
    bienvenida: document.getElementById('textoBienvenida').value,
    banners: document.getElementById('mostrarBanners').value,
    fondo: document.getElementById('colorFondo').value,
    texto: document.getElementById('colorTexto').value
  };

  try {
    const res = await fetch('/api/personalizacion/tienda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert('Configuración guardada correctamente');
    } else {
      throw new Error(result.error || 'Error desconocido');
    }

  } catch (error) {
    console.error('Error al guardar configuración:', error);
    alert('No se pudo guardar la configuración.');
  }
}


  // ===== Formulario Logo / Marca =====
  const formMarca = document.getElementById('formMarca');
  if (formMarca) {
    formMarca.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(formMarca);

      const res = await fetch('/api/personalizacion/marca', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      alert(result.mensaje);
    });
  }

  // ===== Formulario Idioma y Localización =====
  const formIdioma = document.getElementById('formIdioma');
  if (formIdioma) {
    formIdioma.addEventListener('submit', async function (e) {
      e.preventDefault();

      const config = {
        idioma: document.getElementById('idiomaSitio').value,
        zona: document.getElementById('zonaHoraria').value,
        moneda: document.getElementById('monedaSitio').value,
      };

      const res = await fetch('/api/personalizacion/idioma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const result = await res.json();
      alert(result.mensaje);
    });
  }
});

// ===== Mostrar subsecciones específicas =====
function ocultarTodasLasSubsecciones() {
  document.getElementById("config-apariencia").classList.add("hidden");
  document.getElementById("config-tienda").classList.add("hidden");
  document.getElementById("config-marca").classList.add("hidden");
  document.getElementById("config-idioma").classList.add("hidden");
}

function mostrarApariencia() {
  ocultarTodasLasSubsecciones();
  document.getElementById("config-apariencia").classList.remove("hidden");
}

// Oculta todas las secciones que tengas en tu app
function ocultarTodasLasSecciones() {
  const secciones = ['configuracion', 'config-tienda', 'seguridad'];
  secciones.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

// Mostrar la sección de configuración principal
function mostrarConfiguracion() {
  ocultarTodasLasSecciones();
  const el = document.getElementById('configuracion');
  if (el) el.classList.remove('hidden');
}

// Mostrar la sección tienda y cargar datos del servidor
async function mostrarTienda() {
  ocultarTodasLasSecciones();
  const el = document.getElementById('config-tienda');
  if (!el) return;

  el.classList.remove('hidden');

  try {
    const response = await fetch('/api/personalizacion/tienda');
    if (!response.ok) throw new Error('Error al obtener configuración');
    const config = await response.json();

    document.getElementById('textoBienvenida').value = config.bienvenida || '';
    document.getElementById('mostrarBanners').value = config.banners || 'si';
    document.getElementById('colorFondo').value = config.fondo || '#ffffff';
    document.getElementById('colorTexto').value = config.texto || '#000000';

  } catch (error) {
    console.error(error);
    alert('No se pudo cargar la configuración de la tienda.');
  }
}

// Mostrar sección de seguridad (ejemplo)
function mostrarSeguridad() {
  ocultarTodasLasSecciones();
  const el = document.getElementById('seguridad');
  if (el) el.classList.remove('hidden');
}




function mostrarLogo() {
  ocultarTodasLasSubsecciones();
  document.getElementById("config-marca").classList.remove("hidden");
}

function mostrarIdioma() {
  ocultarTodasLasSubsecciones();
  document.getElementById("config-idioma").classList.remove("hidden");
}



// Función para cambiar la contraseña del usuario
function cambiarContrasena(usuarioId, nuevaContrasena) {
  // Lógica para actualizar la contraseña en la base de datos
  // Asegúrate de cifrar la nueva contraseña antes de almacenarla
}

// Función para asignar un rol a un usuario
function asignarRol(usuarioId, rol) {
  // Lógica para asignar el rol al usuario
  // Asegúrate de que el rol tenga los permisos adecuados
}

// Función para exportar datos
function exportarDatos(formato) {
  // Lógica para exportar datos en el formato especificado
  // Por ejemplo, generar un archivo CSV o Excel
}

// Función para realizar un respaldo
function realizarRespaldo() {
  // Lógica para realizar un respaldo de la base de datos y archivos importantes
  // Asegúrate de que los respaldos se almacenen de forma segura
}

// Función para cargar datos del administrador y mostrar el formulario
async function editarAdministrador(id) {
  try {
    const res = await fetch(`/api/personalizacion/administradores/${id}`);
    if (!res.ok) throw new Error('Administrador no encontrado');

    const admin = await res.json();

    // Rellenar los campos del formulario
    document.getElementById('adminId').value = admin.id;
    document.getElementById('editar-nombre').value = admin.nombre;
    document.getElementById('editar-apellidos').value = admin.apellidos;
    document.getElementById('editar-telefono').value = admin.telefono;
    document.getElementById('editar-correo').value = admin.correo;
    document.getElementById('editar-direccion').value = admin.direccion;

    // Mostrar el formulario de edición
    document.getElementById('form-edicion-admin').classList.remove('hidden');
  } catch (error) {
    console.error('Error al cargar administrador:', error);
    alert('No se pudo cargar el administrador.');
  }
}



document.getElementById('form-editar-admin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('adminId').value;
  const datos = {
    nombre: document.getElementById('editar-nombre').value,
    apellidos: document.getElementById('editar-apellidos').value,
    telefono: document.getElementById('editar-telefono').value,
    correo: document.getElementById('editar-correo').value,
    direccion: document.getElementById('editar-direccion').value,
  };

  try {
    const res = await fetch(`http://localhost:3000/api/personalizacion/administradores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const result = await res.json();
    alert(result.mensaje);

    // Ocultar formulario y refrescar la lista
    document.getElementById('form-edicion-admin').classList.add('hidden');
    cargarAdministradores();
  } catch (err) {
    console.error('Error al actualizar administrador:', err);
    alert('Error al actualizar administrador.');
  }
});

function cancelarEdicion() {
  document.getElementById('form-edicion-admin').classList.add('hidden');
}


// Función para enviar los cambios al servidor
async function actualizarAdministrador(e) {
  e.preventDefault(); // Evita el comportamiento por defecto del formulario

  const id = document.getElementById('adminId').value;

  const datos = {
    nombre: document.getElementById('editar-nombre').value,
    apellidos: document.getElementById('editar-apellidos').value,
    telefono: document.getElementById('editar-telefono').value,
    correo: document.getElementById('editar-correo').value,
    direccion: document.getElementById('editar-direccion').value,
    // Puedes incluir el password aquí si lo tienes en el formulario
    // password: document.getElementById('editar-password').value
  };

  try {
    const res = await fetch(`http://localhost:3000/api/personalizacion/administradores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const result = await res.json();
    alert(result.mensaje);

    document.getElementById('form-edicion-admin').classList.add('hidden'); // Oculta el formulario
    cargarAdministradores(); // Recarga la tabla
  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('Hubo un error al actualizar el administrador.');
  }
}


async function cargarAdministradores() {
  try {
    const res = await fetch('http://localhost:3000/api/personalizacion/administradores');
    const data = await res.json();

    const tbody = document.querySelector('#tabla-administradores tbody');
    tbody.innerHTML = '';

    data.forEach(admin => {
      tbody.innerHTML += `
  <tr>
    <td>${admin.nombre}</td>
    <td>${admin.apellidos}</td>
    <td>${admin.telefono}</td>
    <td>${admin.correo}</td>
    <td>${admin.direccion}</td>
    <td class="text-center">
      <i class="fas fa-edit text-blue-600 cursor-pointer hover:text-blue-800" title="Editar" onclick="editarAdministrador(${admin.id})"></i>
    </td>
  </tr>
`;

    });
  } catch (error) {
    console.error('Error al cargar administradores:', error);
  }
}

async function eliminarAdministrador(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este administrador?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/personalizacion/administradores/${id}`, {
      method: 'DELETE',
    });

    const result = await res.json();
    alert(result.mensaje || 'Administrador eliminado');

    // Recargar la tabla
    cargarAdministradores();
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    alert('No se pudo eliminar el administrador.');
  }
}








document.addEventListener('DOMContentLoaded', function () {
  const botonVerAdmins = document.getElementById('btn-ver-admins');
  const tablaAdmins = document.querySelector('#tabla-administradores tbody');
  const seccionAdmins = document.querySelector('#gestion-administradores');

  if (botonVerAdmins) {
    botonVerAdmins.addEventListener('click', async () => {
      seccionAdmins.classList.remove('hidden');

      try {
        const res = await fetch('http://localhost:3000/api/personalizacion/administradores');
        const data = await res.json();

        // Limpiar tabla
        tablaAdmins.innerHTML = '';

        // Cargar datos con ícono de edición
        data.forEach(admin => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="border-b px-4 py-2">${admin.nombre}</td>
            <td class="border-b px-4 py-2">${admin.apellidos}</td>
            <td class="border-b px-4 py-2">${admin.telefono}</td>
            <td class="border-b px-4 py-2">${admin.correo}</td>
            <td class="border-b px-4 py-2">${admin.direccion}</td>
            <td class="border-b px-4 py-2 text-center">
              <i class="fas fa-edit text-blue-600 cursor-pointer hover:text-blue-800" title="Editar"
                 onclick='editarAdministrador(${JSON.stringify(admin)})'></i>
            </td>
          `;
          tablaAdmins.appendChild(row);
        });

      } catch (error) {
        console.error('Error al cargar administradores:', error);
      }
    });
  }
});

//_____________________________CODIGO SEGURIDAD Y CONTRASEÑA____________________________________//

const API__BASE = 'http://localhost:3000';

// Carga y muestra la lista de administradores con opción para cambiar contraseña
async function cargarAdministradoresSeguridad() {
  try {
    const res = await fetch(`${API_BASE}/api/personalizacion/administradores`);
    if (!res.ok) throw new Error('Error al obtener administradores');
    const admins = await res.json();

    const tbody = document.querySelector('#tabla-seguridad-admins tbody');
    tbody.innerHTML = '';

    admins.forEach(admin => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${admin.nombre} ${admin.apellidos}</td>
        <td>${admin.correo}</td>
        <td>
          <button class="btn-cambiar-pass" data-id="${admin.id}">Cambiar contraseña</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Asignar evento a botones de cambiar contraseña
    document.querySelectorAll('.btn-cambiar-pass').forEach(btn => {
      btn.addEventListener('click', () => mostrarFormularioCambiarContrasena(btn.dataset.id));
    });

  } catch (error) {
    console.error('Error al cargar administradores:', error);
    alert('No se pudo cargar la lista de administradores.');
  }
}

// Muestra formulario para cambiar contraseña
function mostrarFormularioCambiarContrasena(adminId) {
  const form = document.getElementById('form-cambiar-contrasena');
  form.dataset.adminId = adminId;  // Guardar id admin en dataset

  form.classList.remove('hidden');
  form.reset();

  // Opcional: mostrar el adminId o nombre en el formulario
  document.getElementById('adminIdDisplay').textContent = `ID: ${adminId}`;
}

// Maneja el submit del formulario cambiar contraseña
document.getElementById('form-cambiar-contrasena').addEventListener('submit', async function(e) {
  e.preventDefault();

  const adminId = this.dataset.adminId;
  const nuevaPass = document.getElementById('nuevaContrasena').value;
  const confirmarPass = document.getElementById('confirmarContrasena').value;

  if (nuevaPass !== confirmarPass) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  if (nuevaPass.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/personalizacion/administradores/${adminId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: nuevaPass })
    });

    const result = await res.json();

    if (res.ok) {
      alert('Contraseña actualizada correctamente.');
      this.classList.add('hidden');
    } else {
      alert(result.error || 'Error al actualizar la contraseña.');
    }
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    alert('Error al actualizar la contraseña.');
  }
});

// Botón cancelar para ocultar formulario
document.getElementById('btn-cancelar-cambio').addEventListener('click', () => {
  document.getElementById('form-cambiar-contrasena').classList.add('hidden');
});

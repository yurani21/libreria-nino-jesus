// Variables globales
let esculturas = [];
let pagina = 1;
const porPagina = 5;

// Mostrar esculturas

async function mostrarEsculturas() {
  try {
    const res = await fetch("http://localhost:3000/api/esculturas");
    const data = await res.json();
    
    if (data.length === 0) {
      console.log("No hay esculturas disponibles.");
      return;
    }

    console.log("Detalles de las esculturas:", JSON.stringify(data, null, 2)); // Muestra la información completa

    esculturas = data;
    pagina = 1;
    renderizarTabla(esculturas);
  } catch (err) {
    console.error("Error al mostrar esculturas:", err);
  }
}


  
// Editar o crear escultura
async function guardarEscultura() {
  const id = document.getElementById("idEscultura").value.trim();

  const codigo = document.getElementById('codigo').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const precio = document.getElementById('precio').value.trim();
  const pulgadas = document.getElementById('pulgadas').value.trim();
  const stock = document.getElementById('stock').value.trim();
  const imagen = document.getElementById('imagen').files[0];

  // Validación
  if (!codigo || !nombre || !precio || !pulgadas || stock === "" || (!imagen && !id)) {
    alert('Por favor, complete todos los campos. La imagen es obligatoria si está creando una nueva escultura.');
    return;
  }

  const formData = new FormData();
  formData.append('Esc_Codigo', codigo);
  formData.append('Esc_Nombre', nombre);
  formData.append('Esc_Precio', precio);
  formData.append('Esc_Pulgadas', pulgadas);
  formData.append('stock', stock);

  if (imagen) {
    formData.append('Esc_Imagen', imagen);
  }

  const method = id ? "PUT" : "POST";
  const url = id
    ? `http://localhost:3000/api/esculturas/${id}`
    : "http://localhost:3000/api/esculturas";

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Error desconocido");
    }

    alert(result.message || 'Escultura guardada con éxito');
    cerrarFormulario();
    mostrarEsculturas();
  } catch (error) {
    console.error('Error al guardar la escultura:', error);
    alert('Hubo un problema al guardar la escultura. Inténtalo de nuevo más tarde.');
  }
}




// Editar escultura

async function editarEscultura(id) {
  try {
    const res = await fetch("http://localhost:3000/api/esculturas");
    const data = await res.json();
    const escultura = data.find(item => item.Id_Escultura === id);
    if (!escultura) return alert("Escultura no encontrada");

    document.getElementById("modalFormulario").style.display = "block";
    document.getElementById("tituloModal").textContent = "Editar Escultura";
    document.getElementById("idEscultura").value = escultura.Id_Escultura;
    document.getElementById("codigo").value = escultura.Esc_Codigo;
    document.getElementById("nombre").value = escultura.Esc_Nombre;
    document.getElementById("precio").value = escultura.Esc_Precio;
    document.getElementById("pulgadas").value = escultura.Esc_Pulgadas;
    document.getElementById("stock").value = escultura.stock;
  } catch (err) {
    console.error("Error al editar:", err);
  }
}

// Eliminar escultura

async function eliminarEscultura(id) {
  if (!confirm("¿Seguro que deseas eliminar esta escultura?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/esculturas/${id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    alert(result.message);
    mostrarEsculturas();
  } catch (err) {
    console.error("Error al eliminar escultura:", err);
  }
}

// Mostrar formulario (crear)
function mostrarFormulario() {
  document.getElementById("modalFormulario").style.display = "block";
  document.getElementById("tituloModal").textContent = "Nueva Escultura";
  document.getElementById("idEscultura").value = "";
  document.getElementById("codigo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("pulgadas").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("imagen").value = "";
}

// Cerrar formulario
function cerrarFormulario() {
  document.getElementById("modalFormulario").style.display = "none";
}

// Buscar esculturas
function buscarEsculturas() {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const filas = document.querySelectorAll("#tablaEsculturas tr");

  filas.forEach(fila => {
    const codigo = fila.children[1].innerText.toLowerCase();
    if(codigo.includes(filtro)){
        fila.style.display = "";
    }else{
        fila.style.display = nombre.includes(filtro) ? "" : "none";
    }
  });
}

function filtrarEsculturas(){
    const filtro = document.getElementById("filtro")
}

// Renderizar tabla con paginación
function renderizarTabla(lista) {
  console.log("Datos de las esculturas para renderizar:", lista); // Ver los datos antes de renderizarlos

  const tabla = document.querySelector("#tablaEsculturas");

  tabla.innerHTML = "";

  const inicio = (pagina - 1) * porPagina;
  const paginadas = lista.slice(inicio, inicio + porPagina);

  paginadas.forEach(escultura => {
      // Renderizar cada escultura en la tabla
      const fila = document.createElement("tr");
      fila.innerHTML = `
          <td>${escultura.Esc_Codigo}</td>
          <td>${escultura.Esc_Nombre}</td>
          <td>${parseInt(escultura.Esc_Precio)}</td>
          <td>${escultura.Esc_Pulgadas}</td>
          <td><img src="http://localhost:3000${escultura.Esc_Imagen}" style="max-width: 60px; height: auto; object-fit: contain;"></td>
          <td>${escultura.stock}</td> 
          <td>
              <button onclick="editarEscultura(${escultura.Id_Escultura})">Editar</button>
            <button onclick="eliminarEscultura(${escultura.Id_Escultura})">Eliminar</button>
            <button onclick="publicarOcultarEscultura(${escultura.Id_Escultura})">
              ${escultura.publicado ? 'Ocultar' : 'Publicar'}
            </button>

          </td>
      `;
      tabla.appendChild(fila);
  });
}


// Función para publicar u ocultar una escultura
async function publicarOcultarEscultura(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/esculturas/publicar-ocultar/${id}`, {
      method: "PUT"
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Error desconocido");

    alert("Escultura actualizada correctamente!");
    mostrarEsculturas(); // Refrescar las esculturas en el panel
  } catch (err) {
    console.error("Error al cambiar el estado de la escultura:", err);
    alert("Hubo un error al intentar cambiar el estado de la escultura.");
  }
}





// Paginación
function paginaSiguiente() {
  if (pagina * porPagina < esculturas.length) {
    pagina++;
    renderizarTabla(esculturas);
  }
}

function paginaAnterior() {
  if (pagina > 1) {
    pagina--;
    renderizarTabla(esculturas);
  }
}

// Función para publicar una escultura
async function publicarEscultura(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/esculturas/publicar/${id}`, {
      method: "PUT"
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Error desconocido");

    alert("Escultura publicada con éxito!");
    mostrarEsculturas(); // Refrescar las esculturas en el panel
  } catch (err) {
    console.error("Error al publicar escultura:", err);
    alert("Hubo un error al intentar publicar la escultura.");
  }
}


async function cargarEsculturasPublicadas() {
  try {
    const res = await fetch("http://localhost:3000/api/esculturas/catalogo");
    const esculturas = await res.json();
    renderizarCatalogo(esculturas);
  } catch (err) {
    console.error("Error al cargar catálogo:", err);
    document.getElementById("novedades-container").innerHTML = "<p>Error al cargar esculturas.</p>";
  }
}



// Inicialización al cargar
document.addEventListener("DOMContentLoaded", mostrarEsculturas);


// Variables globales
let esculturas = [];
let pagina = 1;
const porPagina = 5;

// Mostrar esculturas

async function mostrarEsculturas() {
    try {
      const res = await fetch("http://localhost:3000/api/esculturas");
      const data = await res.json();
      console.log(data); // Verifica si la respuesta contiene "stock"
      esculturas = data;
      pagina = 1;
      renderizarTabla(esculturas);
    } catch (err) {
      console.error("Error al mostrar esculturas:", err);
    }
  }
  
// Editar escultura

async function guardarEscultura() {
  const id = document.getElementById("idEscultura").value;
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value;
  const pulgadas = document.getElementById("pulgadas").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").files[0];

  if (!codigo || !nombre || !precio || !pulgadas || !stock || (!imagen && !id)) {
    alert("Completa todos los campos. La imagen es obligatoria si estás creando una nueva escultura.");
    return;
  }

  const formData = new FormData();
  formData.append("Esc_Codigo", codigo);
  formData.append("Esc_Nombre", nombre);
  formData.append("Esc_Precio", precio);
  formData.append("Esc_Pulgadas", pulgadas);
  formData.append("stock", stock);
  if (imagen) {
    formData.append("Esc_Imagen", imagen);
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

    if (!res.ok) throw new Error(result.error || "Error desconocido");

    alert(result.message || "Operación exitosa");
    cerrarFormulario();
    mostrarEsculturas();
  } catch (error) {
    console.error('Error al guardar la escultura:', error);
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
    const tabla = document.getElementById("tablaEsculturas");
    tabla.innerHTML = "";

    const inicio = (pagina - 1) * porPagina;
    const paginadas = lista.slice(inicio, inicio + porPagina);

    paginadas.forEach(escultura => {
        // Generar la URL de la imagen
        const imagenURL = `http://localhost:3000/${escultura.Esc_Imagen}`;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${escultura.Esc_Codigo}</td>
            <td>${escultura.Esc_Nombre}</td>
            <td>${parseInt(escultura.Esc_Precio)}</td>
            <td>${escultura.Esc_Pulgadas}</td>
            <td><img src="http://localhost:3000${escultura.Esc_Imagen}"  style="max-width: 60px; height: auto; object-fit: contain;"></td>
            <td>${escultura.stock}</td> 
            <td>
                <button onclick="editarEscultura(${escultura.Id_Escultura})">Editar</button>
                <button onclick="eliminarEscultura(${escultura.Id_Escultura})">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
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

// Inicialización al cargar
document.addEventListener("DOMContentLoaded", mostrarEsculturas);


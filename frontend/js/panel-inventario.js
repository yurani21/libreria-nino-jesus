const categoriasMap = {
    1: "libro",
    2: "biblia",
    3: "novena"
  };
  
  function obtenerIdCategoria(nombreCategoria) {
    const categorias = {
      libro: 1,
      biblia: 2,
      novena: 3
    };
    return categorias[nombreCategoria.toLowerCase()] || 1;
  }
  
  async function mostrarPublicaciones() {
    try {
      const res = await fetch("http://localhost:3000/api/libros");
      const data = await res.json();
  
      if (!Array.isArray(data)) {
        console.error('La respuesta no es un array:', data);
        return;
      }
  
      libros = data;
      renderizarTablaLibros();
      const tabla = document.getElementById("tablaPublicaciones");
      tabla.innerHTML = "";
  
      data.forEach(libro => {
        const categoriaNombre = categoriasMap[libro.Lib_Categoria] || "Desconocida";
  
        // Aseguramos que el precio se muestre como un número entero
        let precio = libro.Lib_Precio;
        precio = Math.round(precio); // Redondeamos el precio a un número entero
  
        const fila = `
          <tr>
            <td>${libro.Lib_Codigo}</td>
            <td>${libro.Lib_Titulo}</td>
            <td>$${precio}</td>
            <td>${libro.Lib_Editorial}</td>
            <td>${categoriaNombre}</td>
            <td>${libro.stock}</td>
            <td><img src="http://localhost:3000${libro.Lib_Imagen}" width="60"></td>
            <td>
              <button onclick="editarPublicacion(${libro.Id_Libro})">Editar</button>
              <button onclick="eliminarPublicacion(${libro.Id_Libro})">Eliminar</button>
            </td>
          </tr>
        `;
        tabla.innerHTML += fila;
      });
    } catch (err) {
      console.error("Error al mostrar publicaciones:", err);
    }
  }
  
  async function guardarPublicacion() {
    const id = document.getElementById("idLibro").value;
  
    const codigo = document.getElementById("codigo").value.trim();
    const titulo = document.getElementById("nombre").value.trim();
    const precio = document.getElementById("precio").value;
    const editorial = document.getElementById("editorial").value.trim();
    const categoriaTexto = document.getElementById("categoria").value;
    const categoria = obtenerIdCategoria(categoriaTexto);
    const stock = document.getElementById("stock").value; 
    const imagen = document.getElementById("imagen").files[0];
  
    if (!codigo || !titulo || !precio || !editorial || !categoria || !stock || (!imagen && !id)) {
      alert("Por favor, completa todos los campos. La imagen es obligatoria si estás creando un nuevo libro.");
      return;
    }
  
    const formData = new FormData();
    formData.append("Lib_Codigo", codigo);
    formData.append("Lib_Titulo", titulo);
    formData.append("Lib_Precio", precio);
    formData.append("Lib_Editorial", editorial);
    formData.append("Lib_Categoria", categoria);
    formData.append("stock", stock); 
  
    if (imagen) {
      formData.append("Lib_Imagen", imagen);
    }
  
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3000/api/libros/${id}`
      : "http://localhost:3000/api/libros";
  
    try {
      const res = await fetch(url, {
        method,
        body: formData
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.error || "Error desconocido");
      }
  
      alert(result.message || "Operación exitosa");
      cerrarFormulario();
      mostrarPublicaciones();
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    }
  }
  
  async function editarPublicacion(id) {
    try {
      const res = await fetch("http://localhost:3000/api/libros");
      const data = await res.json();
      const libro = data.find(item => item.Id_Libro === id);
      if (!libro) return alert("Libro no encontrado");
  
      document.getElementById("modalAgregar").style.display = "block";
      document.getElementById("titulo-modal").textContent = "Editar Producto";
      document.getElementById("idLibro").value = libro.Id_Libro;
      document.getElementById("codigo").value = libro.Lib_Codigo;
      document.getElementById("nombre").value = libro.Lib_Titulo;
      document.getElementById("precio").value = libro.Lib_Precio;
      document.getElementById("editorial").value = libro.Lib_Editorial;
      document.getElementById("stock").value = libro.stock; // Usamos 'stock' en vez de 'Lib_Stock'
      document.getElementById("categoria").value = categoriasMap[libro.Lib_Categoria];
    } catch (err) {
      console.error("Error al editar:", err);
    }
  }
  
  async function eliminarPublicacion(id) {
    if (!confirm("¿Seguro que quieres eliminar este libro?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/libros/${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      alert(result.message);
      mostrarPublicaciones();
    } catch (err) {
      console.error("Error al eliminar libro:", err);
    }
  }
  
  function mostrarFormulario() {
    document.getElementById("modalAgregar").style.display = "block";
    document.getElementById("titulo-modal").textContent = "Nuevo Producto";
    document.getElementById("idLibro").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("editorial").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("categoria").value = "libro";
    document.getElementById("imagen").value = "";
  }
  
  function cerrarFormulario() {
    document.getElementById("modalAgregar").style.display = "none";
  }
  
  function filtrarPublicaciones() {
    const filtro = document.getElementById("filtroCategoria").value;
    const filas = document.querySelectorAll("#tablaPublicaciones tr");
  
    filas.forEach(fila => {
      const categoria = fila.children[4].innerText.toLowerCase();
      if (filtro === "todas" || categoria === filtro) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  }
  
  //Buscar libros
  function buscarPublicaciones() {
    const filtro = document.getElementById("buscador").value.toLowerCase();
  
    const filas = document.querySelectorAll("#tablaPublicaciones tr");
    filas.forEach(fila => {
      const titulo = fila.children[1].innerText.toLowerCase();
      const codigo = fila.children[0].innerText.toLowerCase();
  
      fila.style.display = titulo.includes(filtro) || codigo.includes(filtro) ? "" : "none";
    });
  }
  
// Filtrar libros
  function filtrarPublicaciones() {
    const filtro = document.getElementById("filtroCategoria").value.toLowerCase();
  
    const filas = document.querySelectorAll("#tablaPublicaciones tr");
    filas.forEach(fila => {
      const categoria = fila.children[4].innerText.toLowerCase();
      fila.style.display = (filtro === "todas" || categoria === filtro) ? "" : "none";
    });
  }
  
  let libros = []; // Aquí se guardan todos los libros del backend
  let paginaActual = 1;
  const librosPorPagina = 5;  

  
// Función para renderizar productos según la página actual
function renderizarTablaLibros() {
  const tbody = document.getElementById("tablaPublicaciones");
  tbody.innerHTML = "";

  const inicio = (paginaActual - 1) * librosPorPagina;
  const paginados = libros.slice(inicio, inicio + librosPorPagina);

  paginados.forEach(libro => {
    const categoriaNombre = categoriasMap[libro.Lib_Categoria] || "Desconocida";
    const precio = Math.round(libro.Lib_Precio);

    const fila = `
      <tr>
        <td>${libro.Lib_Codigo}</td>
        <td>${libro.Lib_Titulo}</td>
        <td>$${precio}</td>
        <td>${libro.Lib_Editorial}</td>
        <td>${categoriaNombre}</td>
        <td>${libro.stock}</td>
        <td><img src="http://localhost:3000${libro.Lib_Imagen}" width="60"></td>
        <td>
          <button onclick="editarPublicacion(${libro.Id_Libro})">Editar</button>
          <button onclick="eliminarPublicacion(${libro.Id_Libro})">Eliminar</button>
          <button onclick="togglePublicacion(${libro.Id_Libro}, ${libro.Lib_Publicado})">
            ${libro.Lib_Publicado ? "Ocultar" : "Publicar"}
          </button>
        </td>
      </tr>
    `;
    tbody.innerHTML += fila;
  });

  document.getElementById("numeroPagina").textContent = `Página ${paginaActual}`;
}

//paginación
function paginaSiguiente() {
  if (paginaActual * librosPorPagina < libros.length) {
    paginaActual++;
    renderizarTablaLibros();
  }
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarTablaLibros();
  }
}

async function togglePublicacion(id, publicado) {
  const nuevoEstado = publicado ? 0 : 1; // Si está publicado (1), lo cambiamos a oculto (0) y viceversa.

  try {
    const res = await fetch(`http://localhost:3000/api/libros/${id}/publicar`, {
      method: "PUT",
      body: JSON.stringify({ publicado: nuevoEstado }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      mostrarPublicaciones(); // Volver a cargar las publicaciones
    } else {
      alert("Error al actualizar el estado de publicación");
    }
  } catch (error) {
    console.error("Error al cambiar el estado de publicación", error);
  }
}

function mostrarLibrosPublicados() {
  fetch("http://localhost:3000/api/libros/publicados") 
    .then(res => res.json())
    .then(data => {
     
    });
}


  // Mostrar libros al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    mostrarPublicaciones();
  });
  
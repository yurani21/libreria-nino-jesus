async function obtenerLibros() {
  try {
    const res = await fetch('http://localhost:3000/api/libros');
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'Error al obtener libros');
    
    const librosList = document.getElementById('libros-list');
    librosList.innerHTML = ''; // Limpiar la lista antes de agregar los libros
    
    // Verificar si hay libros disponibles
    if (data.length === 0) {
      librosList.innerHTML = '<tr><td colspan="4">No hay libros registrados.</td></tr>';
      return;
    }
    
    // Mostrar los libros con botón de publicar
    data.forEach(libro => {
      const libroElement = `
        <tr>
          <td>${libro.Lib_Titulo}</td>
          <td>${libro.Lib_Editorial}</td>
          <td>$${Math.round(libro.Lib_Precio)}</td>
          <td>
            ${libro.Lib_Publicado == 0 ? 
              `<button onclick="publicarLibro(${libro.Id_Libro})">Publicar</button>` : 
              `<span>Publicado</span>`
            }
          </td>
        </tr>
      `;
      librosList.innerHTML += libroElement;
    });
  } catch (error) {
    console.error('Error al obtener los libros:', error);
  }
}

//publicar libro
async function publicarLibro(idLibro) {
  try {
    const res = await fetch(`http://localhost:3000/api/libros/publicar/${idLibro}`, {
      method: 'PUT',
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Error al publicar el libro');
      return;
    }

    alert('Libro publicado con éxito');
    obtenerLibros(); // Actualizar la lista después de publicar
  } catch (error) {
    console.error('Error al publicar el libro:', error);
    alert('Hubo un problema al intentar publicar el libro');
  }
}

//cargar libros publicados
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("libros-list");

  try {
    const res = await fetch("http://localhost:3000/api/libros/publicados");
    const libros = await res.json();

    if (libros.length === 0) {
      contenedor.innerHTML = "<p>No hay libros disponibles por ahora.</p>";
      return;
    }

    libros.forEach(libro => {
      if (Number(libro.Lib_Categoria) === 1) { 
        const card = document.createElement("div");
        card.classList.add("libro-card");

        card.innerHTML = `
          <img src="http://localhost:3000${libro.Lib_Imagen}" alt="${libro.Lib_Titulo}" width="150">
          <h3>${libro.Lib_Titulo}</h3>
          <p><strong>Editorial:</strong> ${libro.Lib_Editorial}</p>
          <p><strong>Precio:</strong> $${Math.round(libro.Lib_Precio)}</p>
        `;

        contenedor.appendChild(card);
      }
    });

  } catch (error) {
    console.error("Error al cargar los libros publicados:", error);
    contenedor.innerHTML = "<p>Error al cargar los libros.</p>";
  }
});

  


  document.addEventListener('DOMContentLoaded', obtenerLibros);
  
  
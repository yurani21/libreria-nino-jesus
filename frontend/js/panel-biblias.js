async function obtenerBiblias() {
  const contenedor = document.getElementById("biblias-container");  // Cambié aquí de "biblias-list" a "biblias-container"

  try {
    const res = await fetch("http://localhost:3000/api/biblias/publicadas");
    const libros = await res.json();

    if (libros.length === 0) {
      contenedor.innerHTML = "<p>No hay biblias disponibles por ahora.</p>";
      return;
    }

    libros.forEach(libro => {
      if (Number(libro.Lib_Categoria) === 2) { 
        const card = document.createElement("div");
        card.classList.add("biblia-card");

        card.innerHTML = `
          <img src="http://localhost:3000${libro.Lib_Imagen}" alt="${libro.Lib_Titulo}">
          <h3>${libro.Lib_Titulo}</h3>
          <p>$${Math.round(libro.Lib_Precio)}</p>
          <button class="btn-agregar-carrito">🛒</button>
        `;

        contenedor.appendChild(card);
      }
    });

  } catch (error) {
    console.error("Error al cargar las biblias:", error);
    contenedor.innerHTML = "<p>Error al cargar las biblias.</p>";
  }
}

document.addEventListener("DOMContentLoaded", obtenerBiblias);

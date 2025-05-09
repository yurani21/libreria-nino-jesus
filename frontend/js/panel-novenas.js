// archivo: panel-novenas.js
document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("novenas-container");

    try {
      const res = await fetch("http://localhost:3000/api/novenas/publicadas");
  
      if (!res.ok) {
        throw new Error(`Error en la respuesta de la API: ${res.status}`);
      }
  
      const data = await res.json();

  
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no contiene un array de novenas.");
      }
  
      data.forEach(novena => {
        const card = document.createElement("div");
        card.classList.add("libro-card");
        card.innerHTML = `
          <img src="http://localhost:3000${novena.Lib_Imagen}" alt="${novena.Lib_Titulo}" />
          <h3>${novena.Lib_Titulo}</h3>
          <p>$${Math.round(novena.Lib_Precio)}</p>
          <button class="btn-agregar-carrito">🛒</button>
        `;
        contenedor.appendChild(card);
      });
    } catch (error) {
      console.error("Error cargando las novenas:", error);
    }
  });
  
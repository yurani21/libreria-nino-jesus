document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/esculturas/catalogo");
      const esculturas = await res.json();
      renderizarCatalogo(esculturas);
    } catch (err) {
      console.error("Error al cargar esculturas publicadas:", err);
      document.getElementById("esculturas-container").innerHTML = "<p>Error al cargar las esculturas.</p>";
    }
  });
  
  function renderizarCatalogo(lista) {
    const contenedor = document.getElementById("esculturas-container");
    contenedor.innerHTML = "";
  
    if (lista.length === 0) {
      contenedor.innerHTML = "<p>No hay esculturas publicadas aún.</p>";
      return;
    }
  
    lista.forEach(escultura => {
      const card = document.createElement("div");
      card.classList.add("card");
  
      card.innerHTML = `
        <img src="http://localhost:3000${escultura.Esc_Imagen}" alt="${escultura.Esc_Nombre}" />
        <h3>${escultura.Esc_Nombre}</h3>
        <p>${escultura.Esc_Pulgadas} pulgadas</p>
        <p><strong>$${parseFloat(escultura.Esc_Precio).toFixed(2)}</strong></p>
        <button class="btn-agregar-carrito">🛒</button>
      `;
  
      contenedor.appendChild(card);
    });
  }

  // En catalogo-esculturas.js
async function cargarEsculturas() {
    try {
      const res = await fetch("http://localhost:3000/api/esculturas/catalogo");
    //   const data = await res.json(); 
  
      if (res.ok) {
        console.log(data);  // Aquí debes ver las esculturas publicadas
        renderizarCatalogo(data);  // Función para renderizar las esculturas
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (err) {
      console.error("Error al cargar esculturas publicadas:", err);
    }
  }
  
  
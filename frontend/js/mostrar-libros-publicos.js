document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("libros-container");
  const categoria = 'libro'; // Asumiendo que quieres obtener libros de categoría "libro"
  
  try {
    const res = await fetch(`http://localhost:3000/api/libros/publicados?categoria=${categoria}`);

    if (!res.ok) {
      throw new Error(`Error en la respuesta de la API: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("La respuesta no contiene un array de libros.");
    }

    data.forEach(libro => {
      const card = document.createElement("div");
      card.classList.add("libro-card");
      card.innerHTML = `
        <img src="http://localhost:3000${libro.Lib_Imagen}" alt="${libro.Lib_Titulo}" />
        <h3>${libro.Lib_Titulo}</h3>
        <p>$${Math.round(libro.Lib_Precio)}</p>
         <button class="btn-agregar-carrito">🛒</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando los libros publicados:", error);
  }
});




  /// Función para agregar al carrito
function agregarAlCarrito(id_producto) {
  const id_usuario = 1;  // Suponiendo que el usuario tiene ID = 1
  const cantidad = 1;    // Por defecto, agregar 1 unidad

  fetch('http://localhost:3000/api/carrito/agregar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_usuario, id_producto, cantidad })  // Pasamos los datos necesarios en el body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo agregar el producto al carrito');
    }
    return response.json();  // Convertimos la respuesta en JSON
  })
  .then(data => {
    alert(data.message || 'Producto agregado al carrito');
  })
  .catch(error => console.error('Error al agregar al carrito:', error));
}
  
  

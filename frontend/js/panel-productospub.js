document.addEventListener('DOMContentLoaded', () => {
	const contenedor = document.getElementById('productos-container');

	fetch('/api/productos/publicados')
		.then(res => res.json())
		.then(productos => {
			contenedor.innerHTML = '';

			productos.forEach(prod => {
				const card = document.createElement('div');
				card.className = 'card-product';
				card.innerHTML = `
					<div class="container-img">
						<img src="/img/${prod.imagen}" alt="${prod.nombre}">
						${prod.descuento ? `<span class="discount">${prod.descuento}%</span>` : ''}
					</div>
					<div class="content-card-product">
						<h3>${prod.nombre}</h3>
						<span class="add-cart"><i class="fa-solid fa-basket-shopping"></i></span>
						<p class="price">$${prod.precio} <span>$${prod.precio_anterior}</span></p>
					</div>
				`;
				contenedor.appendChild(card);
			});
		})
		.catch(err => {
			console.error('Error cargando productos', err);
			contenedor.innerHTML = '<p>Error al cargar productos.</p>';
		});
});

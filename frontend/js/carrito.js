
document.addEventListener('DOMContentLoaded', () => {
    const userId = 1; // Suponiendo que el usuario tiene ID 1 (puedes cambiarlo dinámicamente)

    // Escucha todos los botones "Agregar al carrito"
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            const cantidad = 1;

            fetch('/api/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: userId,
                    id_producto: productId,
                    cantidad: cantidad
                })
            })
            .then(res => res.text())
            .then(msg => {
                alert('Producto agregado al carrito');
                // Actualizar contador del carrito (opcional)
                const contador = document.querySelector('.number');
                let valor = parseInt(contador.innerText.replace(/[()]/g, ''));
                contador.innerText = `(${valor + 1})`;
            })
            .catch(err => {
                console.error('Error al agregar al carrito:', err);
                alert('No se pudo agregar el producto al carrito.');
            });
        });
    });
});


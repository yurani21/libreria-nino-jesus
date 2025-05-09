// Mostrar formulario al hacer clic en "Agregar una tarjeta nueva"
document.getElementById('add-card-btn').addEventListener('click', function () {
    const form = document.getElementById('add-card-form');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
});



document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const cartSummary = document.getElementById('cart-summary');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const itemCount = document.getElementById('item-count');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const total = document.getElementById('total');

    let cart = [];
    const id_usuario = 1;  // Suponiendo que el ID del usuario está disponible

    // Mostrar/ocultar carrito
    cartIcon.addEventListener('click', () => {
        cartSummary.style.display = (cartSummary.style.display === 'none' || cartSummary.style.display === '') ? 'block' : 'none';
    });

    // Función para cargar el carrito desde el servidor
    async function loadCart(id_usuario) {
        try {
            const response = await fetch(`http://localhost:3000/api/carrito/${id_usuario}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const productos = await response.json();
            console.log(productos);  // Revisa la consola para ver qué productos están siendo devueltos.
    
            if (productos.length > 0) {
                renderCart(productos);  // Llama a la función renderCart solo si hay productos
            } else {
                console.log('Carrito vacío');
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
    }
    

    // Función para agregar productos al carrito
    async function addToCart(product) {
        try {
            const response = await fetch('http://localhost:3000/api/carrito/agregar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, id_libro: product.id, cantidad: 1 })

            });
            
            if (response.ok) {
            
                cart.push(product);  // Solo se actualiza la vista si el servidor lo permite
                renderCart();
            } else {
                console.error('Error al agregar producto al carrito');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud al servidor:', error);
        }
    }

    // Función para eliminar un producto del carrito
    async function removeFromCart(index) {
        const product = cart[index];
        try {
            const response = await fetch('http://localhost:3000/api/carrito/eliminar', {

                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, id_producto: product.id })
            });
            if (response.ok) {
                cart.splice(index, 1);  // Eliminar el producto localmente
                renderCart();  // Actualizar la vista
            } else {
                console.error('Error al eliminar producto del carrito');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud al servidor:', error);
        }
    }

    // Función para mostrar el contenido del carrito
    function renderCart(productos) {
        const cartItems = document.getElementById('cart-items');
        let subtotalAmount = 0;
    
        cartItems.innerHTML = '';  // Limpiar el carrito actual antes de agregar los productos
    
        productos.forEach((item) => {
            subtotalAmount += item.price;
    
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">X</button>
            `;
            cartItems.appendChild(li);
        });
    
        // Actualiza el subtotal, el total y otros valores
        const itemCount = document.getElementById('item-count');
        itemCount.textContent = productos.length;
        
        const subtotal = document.getElementById('subtotal');
        subtotal.textContent = subtotalAmount.toFixed(2);
        
        const shipping = document.getElementById('shipping');
        shipping.textContent = (subtotalAmount > 0 ? 5.00 : 0.00).toFixed(2);
        
        const total = document.getElementById('total');
        total.textContent = (subtotalAmount + (subtotalAmount > 0 ? 5 : 0)).toFixed(2);
    }
    

    // Cargar el carrito al iniciar
    loadCart();

    // EJEMPLO: agregar producto ficticio al carrito
    document.getElementById('finalize-purchase').addEventListener('click', () => {
        addToCart({
            id: 1,  // Este ID debe ser el id_producto en la base de datos
            name: 'Producto de ejemplo',
            price: 20.00,
            image: 'https://via.placeholder.com/75'
        });
    });
});

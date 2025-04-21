// Simulación de datos (puedes reemplazarlo con fetch al backend real)
const resumenInventario = {
  tipos: {
    Libro: 120,
    Biblia: 95,
    Novena: 35
  },
  masVendidos: [
    'Biblia de Estudio Reina Valera',
    'Novena a San Judas',
    'Libro de Oraciones'
  ],
  valorTotal: 48500.50
};

// Mostrar los datos
function mostrarResumenInventario() {
  fetch('http://localhost:3000/resumen-inventario')
    .then(res => res.json())
    .then(data => {
      document.getElementById('cantidad-libros').textContent = `📘 Total de Libros: ${data.tipos.Libro || 0}`;
      document.getElementById('cantidad-biblias').textContent = `📖 Total de Biblias: ${data.tipos.Biblia || 0}`;
      document.getElementById('cantidad-novenas').textContent = `📜 Total de Novenas: ${data.tipos.Novena || 0}`;

      const ulVendidos = document.getElementById('productos-mas-vendidos');
      ulVendidos.innerHTML = '';
      data.masVendidos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;
        ulVendidos.appendChild(li);
      });

      document.getElementById('valor-total-libros').textContent = `💰 Valor total de libros: $${data.valorTotal.toLocaleString()}`;
    })
    .catch(err => console.error('Error al cargar libros:', err));
}

function mostrarResumenEsculturas() {
  fetch('http://localhost:3000/resumen-esculturas')
    .then(res => res.json())
    .then(data => {
      document.getElementById('total-esculturas').textContent = `🗿 Total de Esculturas: ${data.total}`;

      const ulVendidas = document.getElementById('esculturas-mas-vendidas');
      ulVendidas.innerHTML = '';
      data.masVendidos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;
        ulVendidas.appendChild(li);
      });

      document.getElementById('valor-total-esculturas').textContent = `💰 Valor total de esculturas: $${data.valorTotal.toLocaleString()}`;
    })
    .catch(err => console.error('Error al cargar esculturas:', err));
}

// Mostrar al entrar a detalles-inventario
if (typeof showSection === 'function') {
  const original = showSection;
  showSection = function (seccionId) {
    original(seccionId);
    if (seccionId === 'detalles-inventario') {
      mostrarResumenInventario();
      mostrarResumenEsculturas();
    }
  };
}

// Mostrar resumen cuando se abra la sección
if (typeof showSection === 'function') {
  const original = showSection;
  showSection = function (seccionId) {
    original(seccionId);
    if (seccionId === 'detalles-inventario') {
      mostrarResumenInventario();
      mostrarResumenEsculturas();
    }
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Cargar cantidad total por tipo de producto
    const cantidadProductosRes = await fetch('http://localhost:3000/api/reportes/cantidad-productos');
    const cantidadProductosData = await cantidadProductosRes.json();

    const productosCantidad = document.getElementById('productos-cantidad');
    productosCantidad.innerHTML = '';

    cantidadProductosData.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.tipo}: ${producto.cantidad}`;
      productosCantidad.appendChild(li);
    });

    // Cargar los productos más vendidos
    const productosVendidosRes = await fetch('http://localhost:3000/api/reportes/inventario');
    const productosVendidosData = await productosVendidosRes.json();
    const listaVendidos = document.getElementById('productos-mas-vendidos');
    listaVendidos.innerHTML = '';

    productosVendidosData.forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto.nombre} - ${producto.total_vendido} vendidos`;
      listaVendidos.appendChild(li);
    });

    // Cargar el valor total del inventario
    const valorInventarioRes = await fetch('http://localhost:3000/api/reportes/valor-inventario');
    const valorInventarioData = await valorInventarioRes.json();
    document.getElementById('valor-total').textContent = `Valor total del inventario: $${valorInventarioData.valor_total}`;
    
  } catch (error) {
    console.error('Error al cargar los datos del resumen:', error);
  }
});

// Función para mostrar secciones
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';
  }
}

function exportarResumenPDF() {
  const elemento = document.getElementById('area-para-pdf');


  const opciones = {
    margin:       0.5,
    filename:     'resumen-inventario.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opciones).from(elemento).save();
}

//Función para llamar gráficas
function graficarLibros(tipos) {
  const ctx = document.getElementById('grafico-libros').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Libros', 'Biblias', 'Novenas'],
      datasets: [{
        label: 'Cantidad',
        data: [tipos.Libro || 0, tipos.Biblia || 0, tipos.Novena || 0],
        backgroundColor: ['#3498db', '#e67e22', '#9b59b6'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Distribución de Libros/Biblias/Novenas'
        }
      }
    }
  });
}
graficarLibros(data.tipos);

function graficarEsculturas(total) {
  const ctx = document.getElementById('grafico-esculturas').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Esculturas registradas'],
      datasets: [{
        label: 'Cantidad',
        data: [total],
        backgroundColor: ['#f39c12'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Cantidad de Esculturas'
        }
      }
    }
  });
}
graficarEsculturas(data.total);



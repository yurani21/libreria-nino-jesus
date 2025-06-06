<<<<<<< HEAD
// Función para mostrar el resumen de inventario de libros
function mostrarResumenInventario() {
  fetch('http://localhost:3000/api/reportes/resumen-inventario')
    .then(res => res.json())
    .then(data => {
      console.log(data); // Verifica los datos que recibes

      document.getElementById('cantidad-libros').textContent = `Total de Libros: ${data.tipos.Libro || 0}`;
      document.getElementById('cantidad-biblias').textContent = `Total de Biblias: ${data.tipos.Biblia || 0}`;
      document.getElementById('cantidad-novenas').textContent = `Total de Novenas: ${data.tipos.Novena || 0}`;

      const ulVendidos = document.getElementById('productos-mas-vendidos');
      ulVendidos.innerHTML = '';
      data.masVendidos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;
        ulVendidos.appendChild(li);
      });

      document.getElementById('valor-total-libros').textContent = `Valor total de libros: ${data.valorTotal}`;

      graficarLibros(data.tipos); // Llama a la gráfica
    })
    .catch(err => {
      console.error('Error al cargar libros:', err);
      alert('Hubo un error al cargar los datos del inventario.');
    });
}

// Función para mostrar el resumen de inventario de esculturas
function mostrarResumenEsculturas() {
  fetch('http://localhost:3000/api/reportes/resumen-esculturas')
    .then(res => res.json())
    .then(data => {
      document.getElementById('total-esculturas').textContent = `Total de Esculturas: ${data.total}`;

      const ulVendidas = document.getElementById('esculturas-mas-vendidas');
      ulVendidas.innerHTML = '';
      data.masVendidos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;
        ulVendidas.appendChild(li);
      });

      document.getElementById('valor-total-esculturas').textContent = `Valor total de esculturas: $${data.valorTotal.toLocaleString()}`;

      graficarEsculturas(data.total);
    })
    .catch(err => console.error('Error al cargar esculturas:', err));
}

// Evento que se ejecuta cuando la página está lista
document.addEventListener('DOMContentLoaded', () => {
  // Esto se puede quitar o dejar si tienes una sección aparte
  fetch('http://localhost:3000/api/reportes/cantidad-productos')
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) throw new Error("No es un array");
      const productosCantidad = document.getElementById('productos-cantidad');
      if (productosCantidad) {
        productosCantidad.innerHTML = '';
        data.forEach(producto => {
          const li = document.createElement('li');
          li.textContent = `${producto.tipo}: ${producto.cantidad}`;
          productosCantidad.appendChild(li);
        });
      }
    })
    .catch(err => console.error('Error cargando cantidad-productos:', err));

  // Mostrar la sección de reportes automáticamente al cargar la página
  showSection('reportes');
});

//FUNCION PARA MOSTRAR LAS SECCIONES DE REPORTES

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.style.display = 'none');

  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';

    if (sectionId === 'detalles-inventario') {
      mostrarResumenInventario();
      mostrarResumenEsculturas();
    }

    if (sectionId === 'movimientos') {
      cargarMovimientosInventario();
    }

    if (sectionId === 'alertas') {
      cargarAlertas();
    }

    // 👇 NUEVO: Si la sección es ventas, carga el reporte de ventas
    if (sectionId === 'ventas') {
      cargarVentas();
    }
  }
}


// Función para exportar el resumen a PDF
function exportarResumenPDF() {
  const element = document.getElementById('detalles-inventario'); // Asegúrate de que este ID coincida con el del contenedor que deseas exportar

  const opt = {
    margin:       1,
    filename:     'Resumen_Reporte.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 3 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}


// Gráfica para mostrar los datos de libros
  function graficarLibros(tipos) {
      const canvas = document.getElementById('grafico-libros');
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Libros', 'Biblias', 'Novenas'],
          datasets: [{
            data: [tipos.Libro || 0, tipos.Biblia || 0, tipos.Novena || 0],
            backgroundColor: ['#3498db', '#e67e22', '#9b59b6']
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Distribución de Productos' }
          }
        }
      });
}

// Gráfica para mostrar los datos de esculturas
  function graficarEsculturas(total) {
        const canvas = document.getElementById('grafico-esculturas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Esculturas'],
            datasets: [{
              data: [total],
              backgroundColor: ['#f39c12']
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Total Esculturas Registradas' }
            }
          }
        });
      }

// Función para cargar los movimientos de inventario
    function cargarMovimientosInventario() {
      fetch('http://localhost:3000/api/reportes/movimientos')
        .then(res => res.json())
        .then(data => {
          const tablaBody = document.getElementById('tabla-movimientos-body');
          tablaBody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos movimientos

          // Recorrer los movimientos y agregarlos a la tabla
          data.forEach(mov => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${mov.tipo_producto}</td>
              <td>${mov.tipo_movimiento}</td>
              <td>${mov.cantidad}</td>
              <td>${new Date(mov.fecha).toLocaleString()}</td>
              <td>${mov.observacion || 'Sin observación'}</td>
            `;
            tablaBody.appendChild(tr);
          });
        })
        .catch(err => console.error('Error al cargar los movimientos:', err));
    }

// Mostrar y ocultar el formulario
  function mostrarFormularioSalida() {
    document.getElementById('formulario-salida').style.display = 'block';
    document.getElementById('agregar-salida').style.display = 'none';
  }

  function ocultarFormulario() {
      document.getElementById('formulario-salida').style.display = 'none';
      document.getElementById('agregar-salida').style.display = 'block';
    }

// Manejar el envío del formulario
document.getElementById('form-salida').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que el formulario recargue la página

  // Obtener los datos del formulario
  const tipoProducto = document.getElementById('tipo-producto').value;
  const cantidad = document.getElementById('cantidad').value;
  const fecha = document.getElementById('fecha').value;
  const observacion = document.getElementById('observacion').value;
  const registradoPor = document.getElementById('registrado-por').value;

  // Crear el objeto para enviar
  const salida = {
    tipo_producto: tipoProducto,
    tipo_movimiento: 'Salida', 
    cantidad: cantidad,
    fecha: fecha,
    observacion: observacion,
    registrado_por: registradoPor 
  };

  // Verifica que los datos estén bien formateados antes de enviar
  console.log('Datos a enviar:', salida);

  // Enviar los datos al servidor
  fetch('http://localhost:3000/api/movimientos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(salida) 
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then(data => {
    console.log('Movimiento registrado:', data);
    alert('Movimiento registrado correctamente');
    ocultarFormulario();
  })
  .catch(error => {
    console.error('Error al registrar movimiento:', error.message || error);
    alert('Hubo un error al registrar el movimiento. Intenta de nuevo.');
  });
});


// Cargar movimientos
function cargarMovimientosInventario() {
  fetch('http://localhost:3000/api/reportes/movimientos')

    .then(res => res.json())
    .then(data => {
      const tablaBody = document.getElementById('tabla-movimientos-body');
      tablaBody.innerHTML = '';

      data.forEach(mov => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${mov.tipo_producto}</td>
          <td>${mov.tipo_movimiento}</td>
          <td>${mov.cantidad}</td>
          <td>${new Date(mov.fecha).toLocaleString()}</td>
          <td>${mov.observacion || 'Sin observación'}</td>
          <td>${mov.registrado_por || '-'}</td>
        `;
        tablaBody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Error al cargar movimientos:', err);
    });
}


//Funciones de las Alertas
function cargarAlertas() {
  fetch('http://localhost:3000/api/reportes/alertas')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('alertas-dinamicas');
      contenedor.innerHTML = '<h3>🆕 Alertas Nuevas</h3>';

      if (data.length === 0) {
        contenedor.innerHTML += `<p>No hay alertas en este momento.</p>`;
        return;
      }

      data.forEach(alerta => {
        const div = document.createElement('div');
        div.classList.add('alert-card', `alert-${alerta.tipo}`);
        div.innerHTML = `<h3>${formatearTipo(alerta.tipo)}</h3><p>${alerta.mensaje}</p>`;
        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error cargando alertas:', err);
    });
}

// Añade esta función para mostrar bonitos los tipos
function formatearTipo(tipo) {
  const tipos = {
    'stock-bajo': 'Stock Bajo',
    'agotado': 'Producto Agotado',
    'exceso': 'Exceso de Stock',
    'error-movimiento': 'Error de Movimiento'
  };
  return tipos[tipo] || tipo;
}

//Función Ventas
async function cargarVentas() {
  try {
    const res = await fetch('http://localhost:3000/ventas'); // Asegúrate de usar la URL completa si el backend está en otro puerto
    const ventas = await res.json();

    const contenedor = document.getElementById('tablaVentas');
    contenedor.innerHTML = '';

    if (ventas.length === 0) {
      contenedor.textContent = 'No hay ventas registradas.';
      return;
    }

    let html = `<table border="1" width="100%" style="border-collapse: collapse;">
      <thead>
        <tr>
          
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Observación</th>
        </tr>
      </thead>
      <tbody>`;

    ventas.forEach(v => {
      html += `
        <tr>
          
          <td>${v.producto}</td>
          <td>${v.cantidad}</td>
          <td>${v.precio}</td>
          <td>${v.cliente}</td>
          <td>${new Date(v.fecha).toLocaleString()}</td>
          <td>${v.observacion || ''}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    contenedor.innerHTML = html;
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    document.getElementById('tablaVentas').textContent = 'Error al cargar las ventas.';
  }
}

=======
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar sección al hacer clic en los enlaces
  document.querySelectorAll('a[href="#detalles-inventario"]').forEach(link => {
      link.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href");
          document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
          const targetSection = document.querySelector(targetId);
          if (targetSection) targetSection.classList.remove("hidden");
      });
  });

  // Cargar resumen de inventario
  document.querySelector('a[href="#detalles-inventario"]').addEventListener("click", cargarResumenInventario);
});

async function cargarResumenInventario() {
  try {
      const res = await fetch("http://localhost:3000/api/resumen-inventario");
      const data = await res.json();

      console.log('Datos de inventario:', data);  // Esto te muestra los datos que llegan

      // Lista de libros más vendidos
      const listaLibros = document.getElementById("masVendidos");
      listaLibros.innerHTML = "";
      data.masVendidos.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.nombre} (${item.cantidad} ventas)`;
          listaLibros.appendChild(li);
      });

      // Lista de esculturas más vendidas
      const listaEsculturas = document.getElementById("esculturasMasVendidas");
      listaEsculturas.innerHTML = "";
      data.esculturasVendidas.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.nombre} (${item.cantidad} ventas)`;
          listaEsculturas.appendChild(li);
      });

  } catch (err) {
      console.error("Error al obtener el resumen del inventario:", err);
  }

}

// === GRÁFICO DE LIBROS/BIBLIAS/NOVENAS ===
const librosData = {
  labels: ["Libros", "Biblias", "Novenas"],
  datasets: [{
      label: "Cantidad Vendida",
      data: [
          data.masVendidos.find(p => p.nombre.includes("Libro"))?.cantidad || 0,
          data.masVendidos.find(p => p.nombre.includes("Biblia"))?.cantidad || 0,
          data.masVendidos.find(p => p.nombre.includes("Novena"))?.cantidad || 0
      ],
      backgroundColor: ["#6366F1", "#3B82F6", "#8B5CF6"]
  }]
};

new Chart(document.getElementById("graficoLibros"), {
  type: "bar",
  data: librosData,
  options: {
      responsive: true,
      plugins: {
          legend: { display: false },
          title: { display: true, text: "Ventas por Tipo de Libro" }
      }
  }
});

// === GRÁFICO DE ESCULTURAS ===
const esculturasLabels = data.esculturasVendidas.map(item => item.nombre);
const esculturasCantidades = data.esculturasVendidas.map(item => item.cantidad);

new Chart(document.getElementById("graficoEsculturas"), {
  type: "pie",
  data: {
      labels: esculturasLabels,
      datasets: [{
          label: "Ventas",
          data: esculturasCantidades,
          backgroundColor: ["#F59E0B", "#FBBF24", "#FCD34D"]
      }]
  },
  options: {
      responsive: true,
      plugins: {
          title: {
              display: true,
              text: "Esculturas más vendidas"
          }
      }
  }
});


document.getElementById('filtrarFechas').addEventListener('click', function() {
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  if (fechaInicio && fechaFin) {
      // Filtrar los datos según las fechas seleccionadas
      const datosFiltrados = datos.filter(item => {
          const fechaVenta = new Date(item.fecha);
          return fechaVenta >= new Date(fechaInicio) && fechaVenta <= new Date(fechaFin);
      });

      // Actualizar los gráficos con los datos filtrados
      actualizarGraficos(datosFiltrados);
  } else {
      alert('Por favor, seleccione un rango de fechas válido.');
  }
});

function actualizarGraficos(datos) {
  // Lógica para actualizar tus gráficos con los datos filtrados
  // Ejemplo para un gráfico de barras:
  const ctx = document.getElementById('graficoLibros').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: datos.map(item => item.nombre),
          datasets: [{
              label: 'Ventas',
              data: datos.map(item => item.cantidad),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  beginAtZero: true
              }
          }
      }
  });
}

>>>>>>> c80883a (Codigo Act)



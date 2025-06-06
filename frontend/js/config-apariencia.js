// Sistema de Configuración de Apariencia - Solo JavaScript
class ConfiguracionPanel {
    constructor() {
        // Configuración por defecto
        this.defaultConfig = {
            colorPrincipal: '#4f46e5',
            tamanoFuente: '16px',
            densidad: 'normal',
            vistaTabla: 'compacta',
            columnasVisibles: ['codigo', 'nombre', 'precio', 'editorial', 'categoria', 'stock', 'imagen'],
            menuColapsado: false
        };
        
        // Cargar configuración al iniciar
        this.config = this.cargarConfiguracion();
        this.aplicarConfiguracion();
        this.inicializarEventos();
    }
    
    cargarConfiguracion() {
        const configGuardada = localStorage.getItem('panelConfig');
        if (configGuardada) {
            return JSON.parse(configGuardada);
        }
        return {...this.defaultConfig};
    }
    
    guardarConfiguracion() {
        localStorage.setItem('panelConfig', JSON.stringify(this.config));
        this.aplicarConfiguracion();
    }
    
    aplicarConfiguracion() {
        // Aplicar color principal
        document.documentElement.style.setProperty('--color-primario', this.config.colorPrincipal);
        
        // Aplicar tamaño de fuente
        document.documentElement.style.fontSize = this.config.tamanoFuente;
        
        // Aplicar densidad
        document.body.classList.remove('densidad-compacta', 'densidad-normal', 'densidad-espaciada');
        document.body.classList.add(`densidad-${this.config.densidad}`);
        
        // Aplicar vista de tabla
        document.body.classList.remove('tabla-compacta', 'tabla-espaciada');
        document.body.classList.add(`tabla-${this.config.vistaTabla}`);
        
        // Aplicar columnas visibles
        this.aplicarColumnasVisibles();
        
        // Aplicar estado del menú
        const sidebar = document.querySelector('.sidebar');
        if (this.config.menuColapsado) {
            sidebar.classList.add('colapsado');
        } else {
            sidebar.classList.remove('colapsado');
        }
    }
    
    aplicarColumnasVisibles() {
        document.querySelectorAll('[data-columna]').forEach(columna => {
            const nombreColumna = columna.getAttribute('data-columna');
            if (this.config.columnasVisibles.includes(nombreColumna)) {
                columna.style.display = '';
            } else {
                columna.style.display = 'none';
            }
        });
    }
    
    inicializarEventos() {
        // Botón de configuración
        document.getElementById('btn-config-apariencia')?.addEventListener('click', () => {
            this.mostrarModalConfig();
        });
        
        // Evento para alternar menú
        document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
            this.config.menuColapsado = !this.config.menuColapsado;
            this.guardarConfiguracion();
        });
    }
    
    mostrarModalConfig() {
        // Crear modal dinámicamente
        const modalHTML = `
        <div id="modal-config" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div class="flex justify-between items-center border-b p-4">
                    <h3 class="text-lg font-semibold text-gray-800">Configurar Apariencia</h3>
                    <button id="cerrar-modal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Diseño y Distribución -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Diseño y Distribución</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Vista de Tabla</label>
                                <div class="flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input type="radio" name="vista-tabla" value="compacta" class="form-radio" ${this.config.vistaTabla === 'compacta' ? 'checked' : ''}>
                                        <span class="ml-2">Compacta</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" name="vista-tabla" value="espaciada" class="form-radio" ${this.config.vistaTabla === 'espaciada' ? 'checked' : ''}>
                                        <span class="ml-2">Espaciada</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Columnas Visibles</label>
                                <div class="space-y-2">
                                    ${['codigo', 'nombre', 'precio', 'editorial', 'categoria', 'stock', 'imagen'].map(col => `
                                    <label class="inline-flex items-center">
                                        <input type="checkbox" name="columnas" value="${col}" class="form-checkbox" ${this.config.columnasVisibles.includes(col) ? 'checked' : ''}>
                                        <span class="ml-2">${col.charAt(0).toUpperCase() + col.slice(1)}</span>
                                    </label>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Personalización Visual -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Personalización Visual</h4>
                        <div class="space-y-4">
                            <div>
                                <label for="tema-color" class="block text-sm font-medium text-gray-700 mb-1">Color Principal</label>
                                <input type="color" id="tema-color" value="${this.config.colorPrincipal}" class="w-full h-10">
                            </div>
                            <div>
                                <label for="tamano-fuente" class="block text-sm font-medium text-gray-700 mb-1">Tamaño de Fuente</label>
                                <select id="tamano-fuente" class="w-full border rounded-lg px-3 py-2">
                                    <option value="14px" ${this.config.tamanoFuente === '14px' ? 'selected' : ''}>Pequeño</option>
                                    <option value="16px" ${this.config.tamanoFuente === '16px' ? 'selected' : ''}>Mediano</option>
                                    <option value="18px" ${this.config.tamanoFuente === '18px' ? 'selected' : ''}>Grande</option>
                                </select>
                            </div>
                            <div>
                                <label for="densidad" class="block text-sm font-medium text-gray-700 mb-1">Densidad</label>
                                <select id="densidad" class="w-full border rounded-lg px-3 py-2">
                                    <option value="compacta" ${this.config.densidad === 'compacta' ? 'selected' : ''}>Compacta</option>
                                    <option value="normal" ${this.config.densidad === 'normal' ? 'selected' : ''}>Normal</option>
                                    <option value="espaciada" ${this.config.densidad === 'espaciada' ? 'selected' : ''}>Espaciada</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t flex justify-end space-x-3">
                    <button id="cancelar-config" class="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button id="guardar-config" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
        `;
        
        // Insertar modal en el DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Eventos del modal
        document.getElementById('cerrar-modal').addEventListener('click', this.cerrarModal);
        document.getElementById('cancelar-config').addEventListener('click', this.cerrarModal);
        document.getElementById('guardar-config').addEventListener('click', () => {
            this.actualizarConfiguracion();
            this.cerrarModal();
        });
        
        // Previsualización en tiempo real
        document.getElementById('tema-color').addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--color-primario', e.target.value);
        });
        
        document.getElementById('tamano-fuente').addEventListener('change', (e) => {
            document.documentElement.style.fontSize = e.target.value;
        });
        
        document.getElementById('densidad').addEventListener('change', (e) => {
            document.body.classList.remove('densidad-compacta', 'densidad-normal', 'densidad-espaciada');
            document.body.classList.add(`densidad-${e.target.value}`);
        });
    }
    
    actualizarConfiguracion() {
        // Obtener valores del formulario
        this.config.colorPrincipal = document.getElementById('tema-color').value;
        this.config.tamanoFuente = document.getElementById('tamano-fuente').value;
        this.config.densidad = document.getElementById('densidad').value;
        this.config.vistaTabla = document.querySelector('input[name="vista-tabla"]:checked').value;
        
        // Obtener columnas seleccionadas
        this.config.columnasVisibles = Array.from(
            document.querySelectorAll('input[name="columnas"]:checked')
        ).map(el => el.value);
        
        // Guardar configuración
        this.guardarConfiguracion();
    }
    
    cerrarModal() {
        const modal = document.getElementById('modal-config');
        if (modal) {
            modal.remove();
            // Restaurar configuración guardada
            this.aplicarConfiguracion();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ConfiguracionPanel();
});
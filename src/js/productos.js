/**
 * Catálogo de Productos - Hermanos Jota
 * Lógica de renderizado dinámico, búsqueda interactiva y animaciones nativas.
 */

// 1. Importamos los productos y el componente de tarjeta
import { productos } from './datos-productos.js';
import { crearTarjetaProducto, configurarSeleccionProducto } from './tarjeta-producto.js';

// 2. Elementos del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const buscadorInput = document.getElementById('buscador-productos');
const btnVerCatalogo = document.getElementById('btn-ver-catalogo');

// 4. Renderizado del listado de productos
const renderizarCatalogo = (listaProductos) => {
    if (!contenedorProductos) return;

    if (listaProductos.length === 0) {
        // Microcopy siguiendo tono cálido de la marca
        contenedorProductos.innerHTML = `<p class="mensaje-vacio">Todavía no elegiste ninguna pieza. Están esperando en el taller.</p>`;
        return;
    }

    const htmlProductos = listaProductos.map(crearTarjetaProducto).join('');
    contenedorProductos.innerHTML = htmlProductos;
};

// 5. Carga asíncrona simulada de la API
const cargarDatosAsync = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos);
        }, 900); // 900ms para simular la petición de red
    });
};

// 6. Lógica principal de inicialización
const inicializarCatalogo = async () => {
    try {
        const datosCargados = await cargarDatosAsync();
        renderizarCatalogo(datosCargados);
    } catch (error) {
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `<p class="mensaje-vacio">Tuvimos un inconveniente al abrir el taller virtual. Por favor, recargá la página.</p>`;
        }
    }
};

// 7. Interacción: Búsqueda dinámica
if (buscadorInput) {
    buscadorInput.addEventListener('input', (evento) => {
        const terminoBusqueda = evento.target.value.toLowerCase().trim();
        
        const productosFiltrados = productos.filter((prod) => {
            const material = (prod.especificaciones?.materiales || prod.especificaciones?.estructura || prod.material || '').toLowerCase();
            return prod.nombre.toLowerCase().includes(terminoBusqueda) || 
                   material.includes(terminoBusqueda);
        });
        
        renderizarCatalogo(productosFiltrados);
    });
}

// 8. Interacción: Scroll Suave Accesible
const realizarScrollSuave = (elementoDestino) => {
    if (!elementoDestino) return;
    
    // Verificamos preferencia de movimiento reducido por accesibilidad
    const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefiereReducirMovimiento) {
        elementoDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        elementoDestino.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
};

if (btnVerCatalogo && contenedorProductos) {
    btnVerCatalogo.addEventListener('click', () => {
        realizarScrollSuave(contenedorProductos);
    });
}

// 9. Interacción: Guardar producto seleccionado en LocalStorage y navegar
configurarSeleccionProducto(contenedorProductos, productos);

// Disparador cuando el DOM está listo
document.addEventListener('DOMContentLoaded', inicializarCatalogo);

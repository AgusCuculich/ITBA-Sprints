/**
 * Catálogo de Productos - Hermanos Jota
 * Lógica de renderizado dinámico, búsqueda interactiva y animaciones nativas.
 */

// 1. Importamos los productos
import { productos } from './datos-productos.js';


// 2. Elementos del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const buscadorInput = document.getElementById('buscador-productos');
const spanAnio = document.getElementById('anio-actual');
const btnVerCatalogo = document.getElementById('btn-ver-catalogo');

// 3. Inicialización del año de historia (según Manual)
const calcularAnioHistoria = () => {
    if (spanAnio) {
        const anosHistoria = new Date().getFullYear() - 1960;
        spanAnio.textContent = `- ${anosHistoria} años de historia en la madera.`;
    }
};

// 4. Construcción HTML de las tarjetas
const crearTarjetaProducto = (producto) => {
    const urlImagen = `assets/images/${producto.imagen}`;
    // Requisito: dejar comentario si la imagen no existe
    const comentarioFaltaFoto = `<!-- FALTA: foto de ${producto.nombre}, plano general con luz cálida de tarde (${urlImagen}) -->`;
    
    const etiquetaSustentable = producto.sustentable 
        ? `<span class="etiqueta-sustentable" aria-label="Producto sustentable certificado FSC">Eco-friendly</span>` 
        : '';

    return `
        <article class="tarjeta-producto">
            <div class="contenedor-imagen">
                ${comentarioFaltaFoto}
                <img src="${urlImagen}" alt="${producto.nombre}" class="imagen-producto" loading="lazy">
                ${etiquetaSustentable}
            </div>
            <div class="info-producto">
                <h2 class="nombre-producto">${producto.nombre}</h2>
                <div class="contenedor-cta">
                    <button type="button" class="btn-primario btn-sumar-hogar" data-id="${producto.id}">Sumalo a tu hogar</button>
                </div>
            </div>
        </article>
    `;
};

// 5. Renderizado del listado de productos
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

// 6. Carga asíncrona simulada de la API
const cargarDatosAsync = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos);
        }, 900); // 900ms para simular la petición de red
    });
};

// 7. Lógica principal de inicialización
const inicializarCatalogo = async () => {
    calcularAnioHistoria();
    
    try {
        const datosCargados = await cargarDatosAsync();
        console.log(datosCargados);
        renderizarCatalogo(datosCargados);
    } catch (error) {
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `<p class="mensaje-vacio">Tuvimos un inconveniente al abrir el taller virtual. Por favor, recargá la página.</p>`;
        }
    }
};

// 8. Interacción: Búsqueda dinámica
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

// 9. Interacción: Scroll Suave Accesible
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

// 10. Interacción: Guardar producto seleccionado en LocalStorage y navegar
if (contenedorProductos) {
    contenedorProductos.addEventListener('click', (evento) => {
        const botonSumar = evento.target.closest('.btn-sumar-hogar');
        if (!botonSumar) return;

        const idProducto = botonSumar.dataset.id;
        const productoSeleccionado = productos.find((prod) => prod.id === idProducto);

        if (productoSeleccionado) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
            window.location.href = 'producto.html';
        }
    });
}

// Disparador cuando el DOM está listo
document.addEventListener('DOMContentLoaded', inicializarCatalogo);

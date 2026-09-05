/**
 * Detalle de Producto - Hermanos Jota
 * Lógica para la vista de producto individual:
 * - Recuperación del producto desde LocalStorage (o fallback por URL / primer producto).
 * - Renderizado dinámico de imagen, textos, precios y especificaciones técnicas.
 * - Interactividad de selector de cantidad de piezas.
 */

// 1. Importación del catálogo de productos
import { productos } from './datos-productos.js';

// 2. Elementos principales del DOM
const contenedorDetalle = document.getElementById('contenedor-detalle-producto');
const breadcrumbActual = document.getElementById('breadcrumb-producto-actual');

// 3. Utilidad: Formateador de moneda argentina (ARS)
const formatearPrecio = (valor) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(valor);
};

// 4. Utilidad: Obtención del producto seleccionado exclusivamente desde LocalStorage
const obtenerProducto = () => {
    try {
        const productoGuardado = localStorage.getItem('productoSeleccionado');
        if (productoGuardado) {
            const prod = JSON.parse(productoGuardado);
            // Sincronizamos con el array de productos para garantizar datos íntegros
            const prodActualizado = productos.find((p) => p.id === prod.id);
            return prodActualizado || prod;
        }
    } catch (e) {
        console.error('Error al recuperar producto de LocalStorage:', e);
    }

    // Si no se encuentra en LocalStorage, retorna null
    return null;
};

// 5. Renderizado dinámico de la ficha de detalle
const renderizarDetalleProducto = (producto) => {
    if (!contenedorDetalle) return;

    // Manejo de estado en caso de que no se encuentre ningún producto
    if (!producto) {
        contenedorDetalle.innerHTML = `
            <div class="mensaje-estado-detalle">
                <h2>No encontramos la pieza seleccionada</h2>
                <p class="detalle-producto">Podés explorar todas las piezas disponibles en nuestro catálogo.</p>
                <div style="margin-top: 1.5rem;">
                    <a href="productos.html" class="btn-primario">Volver al Catálogo</a>
                </div>
            </div>
        `;
        return;
    }

    // Actualización de accesibilidad y navegación
    document.title = `${producto.nombre} - Hermanos Jota`;
    
    // Actualización dinámica de migas de pan según la página previa del usuario
    const listaMigas = document.querySelector('.lista-migas');
    if (listaMigas) {
        const vinoDeInicio = document.referrer.includes('index.html') || (document.referrer !== '' && new URL(document.referrer, window.location.href).pathname.endsWith('/'));

        if (vinoDeInicio) {
            listaMigas.innerHTML = `
                <li><a href="index.html" class="miga-link">Inicio</a></li>
                <li class="miga-separador">/</li>
                <li class="miga-actual" id="breadcrumb-producto-actual" aria-current="page">${producto.nombre}</li>
            `;
        } else {
            listaMigas.innerHTML = `
                <li><a href="index.html" class="miga-link">Inicio</a></li>
                <li class="miga-separador">/</li>
                <li><a href="productos.html" class="miga-link">Catálogo</a></li>
                <li class="miga-separador">/</li>
                <li class="miga-actual" id="breadcrumb-producto-actual" aria-current="page">${producto.nombre}</li>
            `;
        }
    } else if (breadcrumbActual) {
        breadcrumbActual.textContent = producto.nombre;
    }

    // Construcción de rutas y elementos condicionales
    const urlImagen = `assets/images/${producto.imagen}`;
    const comentarioFaltaFoto = `<!-- FALTA: foto de ${producto.nombre}, plano general de detalle (${urlImagen}) -->`;
    
    const badgeSustentable = producto.sustentable
        ? `<span class="etiqueta-sustentable" aria-label="Producto sustentable certificado FSC">Certificación FSC / Eco</span>`
        : '';

    // Formateo de precio y desglose de cuotas
    const precioFormateado = producto.precio ? formatearPrecio(producto.precio) : '$ 280.000';
    const cuotasTexto = producto.precio 
        ? `3 cuotas sin interés de ${formatearPrecio(Math.round(producto.precio / 3))}`
        : 'Hasta 3 cuotas sin interés con tarjetas bancarias';

    const descripcionTexto = producto.descripcion || 
        'Pieza construida artesanalmente con ensamble tradicional en madera maciza seleccionada. Cada veta cuenta la historia del oficio familiar.';

    // Generación dinámica de la lista de especificaciones técnicas
    const renderizarEspecificaciones = () => {
        if (!producto.especificaciones || typeof producto.especificaciones !== 'object') {
            return '';
        }

        const items = Object.entries(producto.especificaciones)
            .map(([clave, valor]) => {
                // Formatear la clave de camelCase a Title Case / legible
                const etiquetaLegible = clave
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();

                return `
                    <div class="item-especificacion">
                        <dt class="label-especificacion">${etiquetaLegible}:</dt>
                        <dd class="valor-especificacion">${valor}</dd>
                    </div>
                `;
            })
            .join('');

        return `
            <section class="seccion-especificaciones" aria-label="Detalles de fabricación y especificaciones">
                <h2>Especificaciones Técnicas</h2>
                <dl class="lista-especificaciones">
                    ${items}
                </dl>
            </section>
        `;
    };

    const materialAlt = producto.especificaciones?.materiales || producto.especificaciones?.estructura || 'diseño exclusivo';

    // Inyección de la plantilla HTML en el DOM
    contenedorDetalle.innerHTML = `
        <!-- Columna Visual: Fotografía y Badge -->
        <div class="columna-imagen-detalle">
            <div class="envoltura-imagen-grande">
                ${comentarioFaltaFoto}
                <img src="${urlImagen}" alt="${producto.nombre} - ${materialAlt}" class="imagen-detalle-grande" id="imagen-principal">
                ${badgeSustentable}
            </div>
        </div>

        <!-- Columna de Información, Precios y Acciones -->
        <div class="columna-info-detalle">
            <div class="bloque-encabezado-producto">
                <h1 class="titulo-producto-detalle">${producto.nombre}</h1>
                <div class="precio-producto-detalle">${precioFormateado}</div>
                <p class="cuotas-texto">${cuotasTexto}</p>

                <!-- Controles de Compra: Contador y Botón CTA a la par -->
                <div class="bloque-acciones-compra">
                    <div class="control-cantidad">
                        <button type="button" class="btn-cantidad" id="btn-disminuir" aria-label="Disminuir cantidad">-</button>
                        <input type="number" id="cantidad-producto" class="input-cantidad" value="1" min="1" max="10" readonly aria-label="Cantidad">
                        <button type="button" class="btn-cantidad" id="btn-aumentar" aria-label="Aumentar cantidad">+</button>
                    </div>

                    <button type="button" class="btn-primario btn-compra-detalle" id="btn-agregar-carrito">
                        Sumalo a tu hogar
                    </button>
                </div>
            </div>

            <!-- Bloque de Contenido Adicional (Desktop: en columna / Tablet: fila completa inferior) -->
            <div class="bloque-contenido-adicional">
                <!-- Narrativa y descripción de la pieza -->
                <p class="descripcion-producto-detalle">${descripcionTexto}</p>

                <!-- Especificaciones Técnicas y Materiales dinámicos -->
                ${renderizarEspecificaciones()}
            </div>
        </div>
    `;

    // 6. Asignación de interactividad en los controles de la ficha
    configurarControles();
};

// 7. Lógica interactiva de los botones de cantidad (+ / -)
const configurarControles = () => {
    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDisminuir = document.getElementById('btn-disminuir');
    const inputCantidad = document.getElementById('cantidad-producto');

    // Incrementar cantidad (hasta un tope de 10 unidades)
    if (btnAumentar && inputCantidad) {
        btnAumentar.addEventListener('click', () => {
            let actual = parseInt(inputCantidad.value, 10) || 1;
            if (actual < 10) {
                inputCantidad.value = actual + 1;
            }
        });
    }

    // Disminuir cantidad (mínimo 1 unidad)
    if (btnDisminuir && inputCantidad) {
        btnDisminuir.addEventListener('click', () => {
            let actual = parseInt(inputCantidad.value, 10) || 1;
            if (actual > 1) {
                inputCantidad.value = actual - 1;
            }
        });
    }
};

// 8. Inicializador: se ejecuta una vez cargado el DOM
document.addEventListener('DOMContentLoaded', () => {
    const producto = obtenerProducto();
    renderizarDetalleProducto(producto);
});

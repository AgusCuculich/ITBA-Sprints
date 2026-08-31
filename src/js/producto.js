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
    if (breadcrumbActual) {
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

    // Inyección de la plantilla HTML en el DOM
    contenedorDetalle.innerHTML = `
        <!-- Columna Visual: Fotografía y Badge -->
        <div class="columna-imagen-detalle">
            <div class="envoltura-imagen-grande">
                ${comentarioFaltaFoto}
                <img src="${urlImagen}" alt="${producto.nombre} fabricado en ${producto.material}" class="imagen-detalle-grande" id="imagen-principal">
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

                <!-- Especificaciones Técnicas y Materiales -->
                <section class="seccion-especificaciones" aria-label="Detalles de fabricación y medidas">
                    <h2 class="titulo-especificaciones">Especificaciones de Fabricación</h2>
                    <dl class="lista-especificaciones">
                        <div class="item-especificacion">
                            <dt class="label-especificacion">Madera / Material:</dt>
                            <dd class="valor-especificacion">${producto.material}</dd>
                        </div>
                        <div class="item-especificacion">
                            <dt class="label-especificacion">Dimensiones:</dt>
                            <dd class="valor-especificacion">${producto.medidas}</dd>
                        </div>
                        <div class="item-especificacion">
                            <dt class="label-especificacion">Acabado artesanal:</dt>
                            <dd class="valor-especificacion">${producto.acabado}</dd>
                        </div>
                    </dl>
                </section>
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

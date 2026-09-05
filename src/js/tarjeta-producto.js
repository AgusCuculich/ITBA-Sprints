/**
 * Componente Tarjeta de Producto - Hermanos Jota
 * Módulo ES6 reutilizable para renderizar tarjetas de producto
 * y manejar la interacción de selección.
 */

/**
 * Genera el marcado HTML para una tarjeta de producto individual.
 * 
 * @param {Object} producto - Datos del producto a renderizar.
 * @param {string} producto.id - Identificador único.
 * @param {string} producto.nombre - Nombre del producto.
 * @param {string} producto.imagen - Nombre de archivo de la imagen.
 * @param {boolean} [producto.sustentable] - Indica si cuenta con certificación sustentable.
 * @returns {string} String con el HTML del componente <article class="tarjeta-producto">.
 */
export const crearTarjetaProducto = (producto) => {
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
                <button type="button" class="btn-primario btn-sumar-hogar" data-id="${producto.id}">Conocer más detalles</button>
            </div>
        </article>
    `;
};

/**
 * Configura el listener de eventos en un contenedor para guardar el producto seleccionado
 * en LocalStorage y redirigir a la vista de detalle cuando se presiona el botón.
 *
 * @param {HTMLElement} contenedor - Elemento contenedor de las tarjetas.
 * @param {Array<Object>} productos - Lista de productos para buscar el seleccionado.
 */
export const configurarSeleccionProducto = (contenedor, productos) => {
    if (!contenedor) return;

    contenedor.addEventListener('click', (evento) => {
        const botonSumar = evento.target.closest('.btn-sumar-hogar');
        if (!botonSumar) return;

        const idProducto = botonSumar.dataset.id;
        const productoSeleccionado = productos.find((prod) => prod.id === idProducto);

        if (productoSeleccionado) {
            localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
            window.location.href = 'producto.html';
        }
    });
};

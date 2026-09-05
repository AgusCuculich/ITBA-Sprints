import { productos } from './datos-productos.js';

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-destacados');
  if (!contenedor) return;

  // Tomamos los primeros 3 productos
  const destacados = productos ? productos.slice(0, 3) : [];

  contenedor.innerHTML = destacados.map(prod => {
    // 1. Obtener la ruta base del objeto (soporta la propiedad 'imagen' o 'imagenUrl')
    let rutaImagen = prod.imagen || prod.imagenUrl || '';

    // 2. Normalizar la ruta eliminando '../' o './' al inicio para que apunte bien desde la raíz de index.html
    if (rutaImagen) {
      rutaImagen = rutaImagen.replace(/^(\.\.\/|\.\/)+/, '');
      // Si no empieza con 'assets/', se lo agregamos por seguridad
      if (!rutaImagen.startsWith('assets/')) {
        rutaImagen = `assets/images/${rutaImagen}`;
      }
    } else {
      rutaImagen = 'assets/images/placeholder.jpg';
    }

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
  }).join('');
});

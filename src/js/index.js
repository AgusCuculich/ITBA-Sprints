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
      <article class="product-card">
        ${prod.categoria ? `<span class="product-card__tag">${prod.categoria}</span>` : ''}
        <img 
          src="${rutaImagen}" 
          alt="${prod.nombre}" 
          class="product-card__img" 
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80';"
        >
        <div class="product-card__content">
          <h3 class="product-card__title">${prod.nombre}</h3>
          <p class="product-card__desc">${prod.descripcion || ''}</p>
          <a href="producto.html?id=${prod.id}" class="btn-card">VER DETALLE</a>
        </div>
      </article>
    `;
  }).join('');
});

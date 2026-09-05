import { productos } from './datos-productos.js';

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return;

  // Tomamos los primeros 3 productos
  const destacados = productos ? productos.slice(0, 3) : [];

  contenedor.innerHTML = destacados.map(producto => {
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
                <button type="button" class="btn-primario btn-sumar-hogar" data-id="${producto.id}">Sumalo a tu hogar</button>
            </div>
        </article>
    `;
  }).join('');

  // 10. Interacción: Guardar producto seleccionado en LocalStorage y navegar
  if (contenedor) {
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
  }
});

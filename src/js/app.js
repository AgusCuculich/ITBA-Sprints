import { productos } from './datos-productos.js';

// Función para simular petición asíncrona (Async / Await)
function obtenerProductosDestacados() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tomamos los productos de la lista real que tienen sustentable: true (o los primeros 3)
      const destacados = productos.filter(p => p.sustentable).slice(0, 3);
      resolve(destacados);
    }, 800); // Simula retardo de red de 800ms
  });
}

// Renderizado dinámico en el DOM
async function cargarInicio() {
  const containerGrid = document.getElementById("featured-products-grid");
  const loadingState = document.getElementById("loading-state");
  const yearSpan = document.getElementById("current-year");

  // Año dinámico en el footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (!containerGrid) return;

  try {
    const productosDestacados = await obtenerProductosDestacados();
    
    // Ocultar mensaje de carga
    if (loadingState) loadingState.style.display = "none";

    if (productosDestacados.length === 0) {
      containerGrid.innerHTML = "<p>Están esperando en el taller. Próximamente sumaremos nuevas piezas.</p>";
      return;
    }

    // Insertar tarjetas en el DOM con las propiedades reales de datos-productos.js
    containerGrid.innerHTML = productosDestacados.map(prod => `
      <article class="card">
        <img src="${prod.imagen}" alt="${prod.nombre}" class="card__img" onerror="this.src='assets/images/logo.svg';">
        <div class="card__body">
          <h3 class="card__title">${prod.nombre}</h3>
          <p class="card__description">${prod.descripcion}</p>
          <p class="card__price">$${prod.precio.toLocaleString('es-AR')}</p>
          <a href="producto.html?id=${prod.id}" class="btn btn--primary card__link">Sumalo a tu hogar</a>
        </div>
      </article>
    `).join("");

  } catch (error) {
    if (loadingState) {
      loadingState.textContent = "No se pudieron cargar las piezas. Por favor, reintenta más tarde.";
    }
  }
}

document.addEventListener("DOMContentLoaded", cargarInicio);
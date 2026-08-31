// Array local de productos (Simulación de base de datos)
const productosDB = [
  {
    id: 1,
    nombre: "Sillón Algarrobo Taller",
    precio: 145000,
    imagen: "assets/images/sillon-algarrobo.jpg",
    descripcion: "Nacido de una veta recuperada con acabado en aceite de lino.",
    destacado: true
  },
  {
    id: 2,
    nombre: "Mesa Centro Caldén",
    precio: 98000,
    imagen: "assets/images/mesa-calden.jpg",
    descripcion: "Líneas orgánicas inspiradas en el diseño Mid-Century de los 60.",
    destacado: true
  },
  {
    id: 3,
    nombre: "Silla Quebracho",
    precio: 62000,
    imagen: "assets/images/silla-quebracho.jpg",
    descripcion: "Estructura firme en madera nativa con garantía de 10 años.",
    destacado: true
  }
];

// Función para simular petición asíncrona (Async / Await)
function obtenerProductosDestacados() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const destacados = productosDB.filter(p => p.destacado);
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
    const productos = await obtenerProductosDestacados();
    
    // Ocultar mensaje de carga
    if (loadingState) loadingState.style.display = "none";

    if (productos.length === 0) {
      containerGrid.innerHTML = "<p>Están esperando en el taller. Próximamente sumaremos nuevas piezas.</p>";
      return;
    }

    // Insertar tarjetas en el DOM
    containerGrid.innerHTML = productos.map(prod => `
      <article class="card">
        <!-- Comentario: si no existe la foto local, usa el logo como fallback -->
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
class HjHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header-principal">
          <div class="header-contenido">
              <a href="index.html" class="logo-link">
                  <img class="img-logo" src="./assets/images/logo.svg" alt="Hermanos Jota">
              </a>
              <nav class="navegacion-principal">
                  <ul class="lista-nav">
                      <li><a href="index.html" class="link-nav">Home</a></li>
                      <li><a href="productos.html" class="link-nav">Catálogo</a></li>
                      <li><a href="contacto.html" class="link-nav">Contacto</a></li>
                  </ul>
              </nav>
              <div class="contenedor-carrito" aria-label="Carrito de compras">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M17 17h-11v-14h-2" />
                      <path d="M6 5l14 1l-1 7h-13" />
                  </svg>
                  <span class="badge-carrito" id="contador-carrito" style="display: none;">0</span>
              </div>
          </div>
      </header>
    `;

    const rutaActual = window.location.pathname.split('/').pop() || 'index.html';
    const enlaces = this.querySelectorAll('.link-nav');

    enlaces.forEach(enlace => {
      const href = enlace.getAttribute('href');
      if (href === rutaActual || (rutaActual === '' && href === 'index.html')) {
        enlace.classList.add('activo');
      }
    });
    // --- LÓGICA DEL CARRITO (Contador dinámico) ---
    const actualizarContador = () => {
      // Leemos el carrito de LocalStorage, si no hay nada, usamos un array vacío
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      
      // Sumamos las cantidades de todos los productos
      const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
      
      // Buscamos el badge en el DOM de este componente
      const badge = this.querySelector('#contador-carrito');
      if (badge) {
        badge.textContent = totalItems;
        // Solo mostramos el badge si hay más de 0 items
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
      }
    };

    // 1. Calculamos el total apenas carga el header
    actualizarContador();

    // 2. Nos quedamos "escuchando" por si otra pantalla (como producto.js) agrega algo
    window.addEventListener('carritoActualizado', actualizarContador);
  }
}

customElements.define('hj-header', HjHeader);
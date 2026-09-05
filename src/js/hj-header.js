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
                  <span class="badge-carrito">2</span>
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
  }
}

customElements.define('hj-header', HjHeader);
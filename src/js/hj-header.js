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

      <!-- Estilos del panel (Clases simples) -->
      <style>
          .overlay-carrito { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; opacity: 0; visibility: hidden; transition: opacity 0.3s; }
          .overlay-carrito.abierto { opacity: 1; visibility: visible; }
          
          .panel-carrito { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100vh; background: #fff; z-index: 1000; display: flex; flex-direction: column; transition: right 0.3s ease; box-shadow: -4px 0 15px rgba(0,0,0,0.1); }
          .panel-carrito.abierto { right: 0; }
          
          .header-panel { padding: 1.5rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; background: #FAF7F2; }
          .header-panel h2 { margin: 0; font-family: 'Playfair Display', serif; color: #8C5A35; font-size: 1.5rem; }
          .btn-cerrar { background: none; border: none; font-size: 2rem; cursor: pointer; color: #333; line-height: 1; }
          
          .contenido-carrito { flex-grow: 1; overflow-y: auto; padding: 1.5rem; }
          .mensaje-vacio-carrito { text-align: center; color: #666; margin-top: 2rem; font-style: italic; }
          
          .item-carrito { display: flex; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f0f0f0; }
          .item-imagen { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
          .item-detalles { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
          .item-nombre { font-size: 1rem; font-weight: 700; margin: 0 0 0.25rem 0; color: #333; }
          .item-precio { font-size: 0.9rem; color: #666; margin: 0; }
          .item-controles { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
          .btn-eliminar { background: none; border: none; color: #d32f2f; cursor: pointer; font-size: 0.85rem; text-decoration: underline; padding: 0; }
          
          .footer-panel { padding: 1.5rem; border-top: 1px solid #e0e0e0; background: #fff; }
          .total-carrito { display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: #333; }
          .btn-bloque { width: 100%; text-align: center; }
          .contenedor-carrito { cursor: pointer; } /* Para que el ícono parezca un botón */
      </style>

      <!-- Estructura del panel -->
      <div id="overlay-carrito" class="overlay-carrito"></div>
      <div id="panel-carrito" class="panel-carrito" aria-hidden="true">
          <div class="header-panel">
              <h2>Tu selección</h2>
              <button id="btn-cerrar-carrito" class="btn-cerrar" aria-label="Cerrar carrito">×</button>
          </div>
          <div id="contenido-carrito" class="contenido-carrito">
              <!-- Acá se inyectan los productos con JS -->
          </div>
          <div class="footer-panel">
              <div class="total-carrito">
                  <span>Total:</span>
                  <span id="total-precio">$ 0</span>
              </div>
              <button id="btn-iniciar-compra" class="btn-primario btn-bloque">Iniciar compra</button>
          </div>
      </div>
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

    // --- LÓGICA DEL PANEL LATERAL ---
    const btnAbrirCarrito = this.querySelector('.contenedor-carrito');
    const panelCarrito = this.querySelector('#panel-carrito');
    const overlayCarrito = this.querySelector('#overlay-carrito');
    const btnCerrarCarrito = this.querySelector('#btn-cerrar-carrito');
    const contenedorItems = this.querySelector('#contenido-carrito');
    const totalPrecioEl = this.querySelector('#total-precio');

    // Utilidad para formatear la moneda
    const formatearPrecioARS = (valor) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor);
    };

    // Funciones de apertura y cierre
    const abrirPanel = () => {
        panelCarrito.classList.add('abierto');
        overlayCarrito.classList.add('abierto');
        panelCarrito.setAttribute('aria-hidden', 'false');
        renderizarCarrito(); // Dibujamos los items actualizados al abrir
    };

    const cerrarPanel = () => {
        panelCarrito.classList.remove('abierto');
        overlayCarrito.classList.remove('abierto');
        panelCarrito.setAttribute('aria-hidden', 'true');
    };

    // Asignamos los eventos de clic
    if (btnAbrirCarrito) btnAbrirCarrito.addEventListener('click', abrirPanel);
    if (btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarPanel);
    if (overlayCarrito) overlayCarrito.addEventListener('click', cerrarPanel); // Cierra si hacés clic afuera

    // Función principal para dibujar los productos
    const renderizarCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        contenedorItems.innerHTML = ''; // Limpiamos el contenedor
        let total = 0;

        if (carrito.length === 0) {
            contenedorItems.innerHTML = '<p class="mensaje-vacio-carrito">Tu carrito está vacío.<br>¡Sumá piezas a tu hogar!</p>';
            totalPrecioEl.textContent = formatearPrecioARS(0);
            return;
        }

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad; // Vamos sumando el total
            
            // Creamos el HTML de cada producto
            const divItem = document.createElement('div');
            divItem.className = 'item-carrito';
            divItem.innerHTML = `
                <img src="assets/images/${item.imagen}" alt="${item.nombre}" class="item-imagen">
                <div class="item-detalles">
                    <h3 class="item-nombre">${item.nombre}</h3>
                    <p class="item-precio">${formatearPrecioARS(item.precio)} x ${item.cantidad}</p>
                    <div class="item-controles">
                        <button class="btn-eliminar" id="btn-eliminar-${index}">Quitar pieza</button>
                    </div>
                </div>
            `;
            contenedorItems.appendChild(divItem);

            // Le damos vida al botón de "Quitar pieza"
            const btnEliminar = divItem.querySelector(`#btn-eliminar-${index}`);
            btnEliminar.addEventListener('click', () => {
                eliminarDelCarrito(item.id);
            });
        });

        // Actualizamos el total a pagar
        totalPrecioEl.textContent = formatearPrecioARS(total);
    };

    // Función para borrar un producto específico
    const eliminarDelCarrito = (id) => {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Filtramos dejando todos los productos MENOS el que queremos borrar
        carrito = carrito.filter(item => item.id !== id);
        
        // Guardamos el nuevo carrito
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Ejecutamos las actualizaciones
        renderizarCarrito(); // Redibuja la lista (el producto desaparece al instante)
        actualizarContador(); // Baja el numerito verde
    };
  }
}

customElements.define('hj-header', HjHeader);
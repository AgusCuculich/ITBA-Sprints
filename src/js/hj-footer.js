/**
 * Componente Web Reutilizable: Footer - Hermanos Jota
 * Cumple con los requerimientos de diseño Mid-Century Modern y accesibilidad:
 * 1) Ubicación del taller con horarios de atención.
 * 2) Formulario inline de suscripción a newsletter (input y botón en la misma línea).
 * 3) Lista de canales digitales con ícono/logo SVG a la izquierda y texto a la derecha.
 */

class HjFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer-principal">
        <div class="contenedor footer-contenido">
          
          <!-- 1. Ubicación del Taller y Horarios -->
          <section class="footer-bloque footer-taller" aria-labelledby="footer-taller-titulo">
            <h3 id="footer-taller-titulo" class="footer-titulo">Casa Taller</h3>
            <address class="footer-direccion">
              <p>Av. San Juan 2847</p>
              <p>Barrio de San Cristóbal, CABA</p>
            </address>
            <div class="footer-horarios">
              <h4 class="footer-subtitulo">Horarios de atención</h4>
              <p>Lunes a Viernes: 10:00 - 19:00</p>
              <p>Sábados: 10:00 - 14:00</p>
            </div>
          </section>

          <!-- 2. Formulario Inline de Suscripción a Newsletter -->
          <section class="footer-bloque footer-newsletter" aria-labelledby="footer-newsletter-titulo">
            <h3 id="footer-newsletter-titulo" class="footer-titulo">El Taller en tu Correo</h3>
            <p class="footer-texto">Novedades de nuevas piezas, procesos de ebanistería y notas de diseño.</p>
            <form class="formulario-newsletter" id="form-newsletter" novalidate>
              <div class="newsletter-inline">
                <label for="newsletter-email" class="sr-only"></label>
                <input 
                  type="email" 
                  id="newsletter-email" 
                  name="email" 
                  class="newsletter-input" 
                  placeholder="Tu correo electrónico..."
                >
                <button type="submit" class="btn-primario newsletter-boton">Suscribirme</button>
              </div>
            </form>
          </section>

          <!-- 3. Canales Digitales con logo a la izquierda y usuario/canal a la derecha -->
          <section class="footer-bloque footer-canales" aria-labelledby="footer-canales-titulo">
            <h3 id="footer-canales-titulo" class="footer-titulo">Canales Digitales</h3>
            <ul class="lista-canales">
              <li class="item-canal">
                <span class="canal-icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </span>
                <span class="canal-texto">www.hermanosjota.com.ar</span>
              </li>

              <li class="item-canal">
                <span class="canal-icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </span>
                <span class="canal-texto">info@hermanosjota.com.ar</span>
              </li>

              <li class="item-canal">
                <span class="canal-icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                <span class="canal-texto">ventas@hermanosjota.com.ar</span>
              </li>

              <li class="item-canal">
                <span class="canal-icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </span>
                <span class="canal-texto">@hermanosjota_ba</span>
              </li>

              <li class="item-canal">
                <span class="canal-icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                  </svg>
                </span>
                <span class="canal-texto">+54 11 4567-8900</span>
              </li>
            </ul>
          </section>

        </div>

        <!-- Barra inferior de copyright y herencia -->
        <div class="footer-creditos">
          <p class="footer-creditos-texto">&copy; ${new Date().getFullYear()} Hermanos Jota</p>
        </div>
      </footer>
    `;
  }
}

// Registro del Custom Element
customElements.define('hj-footer', HjFooter);

export default HjFooter;

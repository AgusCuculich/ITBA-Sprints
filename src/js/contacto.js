/**
 * Catálogo y Contacto - Hermanos Jota
 * Lógica modular que administra:
 * 1. Navegación fluida entre vistas (Catálogo vs Formulario de Contacto).
 * 2. Renderizado dinámico de productos y búsqueda interactiva traída de productos.js.
 * 3. Selección y guardado de piezas en LocalStorage para detalle de producto.
 * 4. Validación reactiva y avisos accesibles del formulario de contacto.
 */

import { productos } from './datos-productos.js';

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Elementos del DOM
    // --------------------------------------------------------------------------
    // Vistas y Navegación
    const vistaCatalogo = document.getElementById('vista-catalogo');
    const vistaContacto = document.getElementById('vista-contacto');
    const linkNavCatalogo = document.getElementById('link-nav-catalogo');
    const linkNavContacto = document.getElementById('link-nav-contacto');

    // Catálogo
    const contenedorProductos = document.getElementById('contenedor-productos');
    const buscadorInput = document.getElementById('buscador-productos');
    const btnVerCatalogo = document.getElementById('btn-ver-catalogo');
    const spanAnio = document.getElementById('anio-actual');

    // Formulario de Contacto
    const formContacto = document.getElementById('formulario-contacto');
    const avisoContacto = document.getElementById('aviso-contacto');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const textareaMensaje = document.getElementById('mensaje');
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    // --------------------------------------------------------------------------
    // 2. Control de Vistas (Catálogo vs Contacto)
    // --------------------------------------------------------------------------
    const navegarAVista = (nombreVista, actualizarHash = true, enfocarCampo = false) => {
        if (nombreVista === 'catalogo') {
            if (vistaContacto) vistaContacto.classList.remove('vista-activa');
            if (vistaCatalogo) vistaCatalogo.classList.add('vista-activa');

            if (linkNavContacto) {
                linkNavContacto.classList.remove('activo');
                linkNavContacto.removeAttribute('aria-current');
            }
            if (linkNavCatalogo) {
                linkNavCatalogo.classList.add('activo');
                linkNavCatalogo.setAttribute('aria-current', 'page');
            }

            document.title = 'Catálogo - Hermanos Jota';

            if (actualizarHash && window.location.hash !== '#catalogo') {
                history.pushState(null, '', '#catalogo');
            }
        } else {
            // Vista de Contacto
            if (vistaCatalogo) vistaCatalogo.classList.remove('vista-activa');
            if (vistaContacto) vistaContacto.classList.add('vista-activa');

            if (linkNavCatalogo) {
                linkNavCatalogo.classList.remove('activo');
                linkNavCatalogo.removeAttribute('aria-current');
            }
            if (linkNavContacto) {
                linkNavContacto.classList.add('activo');
                linkNavContacto.setAttribute('aria-current', 'page');
            }

            document.title = 'Contacto - Hermanos Jota';

            if (actualizarHash && window.location.hash !== '#contacto') {
                history.pushState(null, '', '#contacto');
            }

            if (enfocarCampo && inputNombre) {
                setTimeout(() => inputNombre.focus(), 150);
            }
        }

        // Verificamos preferencia de movimiento reducido por accesibilidad
        const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefiereReducirMovimiento ? 'auto' : 'smooth' });
    };

    // Listeners de navegación por enlaces
    if (linkNavContacto) {
        linkNavContacto.addEventListener('click', (e) => {
            e.preventDefault();
            navegarAVista('contacto', true, true);
        });
    }

    if (linkNavCatalogo) {
        linkNavCatalogo.addEventListener('click', (e) => {
            e.preventDefault();
            navegarAVista('catalogo', true, false);
        });
    }

    document.querySelectorAll('a[href="#contacto"]').forEach((enlace) => {
        if (enlace !== linkNavContacto) {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                navegarAVista('contacto', true, true);
            });
        }
    });

    document.querySelectorAll('a[href="#catalogo"]').forEach((enlace) => {
        if (enlace !== linkNavCatalogo) {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                navegarAVista('catalogo', true, false);
            });
        }
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#catalogo') {
            navegarAVista('catalogo', false, false);
        } else if (hash === '#contacto') {
            navegarAVista('contacto', false, true);
        }
    });

    // --------------------------------------------------------------------------
    // 3. Lógica del Catálogo de Productos (Traída de productos.js)
    // --------------------------------------------------------------------------
    const calcularAnioHistoria = () => {
        if (spanAnio) {
            const anosHistoria = new Date().getFullYear() - 1960;
            spanAnio.textContent = `- ${anosHistoria} años de historia en la madera.`;
        }
    };

    const crearTarjetaProducto = (producto) => {
        const urlImagen = `assets/images/${producto.imagen}`;
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
                    <div class="contenedor-cta">
                        <button type="button" class="btn-primario btn-sumar-hogar" data-id="${producto.id}">Sumalo a tu hogar</button>
                    </div>
                </div>
            </article>
        `;
    };

    const renderizarCatalogo = (listaProductos) => {
        if (!contenedorProductos) return;

        if (listaProductos.length === 0) {
            contenedorProductos.innerHTML = `<p class="mensaje-vacio">Todavía no elegiste ninguna pieza. Están esperando en el taller.</p>`;
            return;
        }

        const htmlProductos = listaProductos.map(crearTarjetaProducto).join('');
        contenedorProductos.innerHTML = htmlProductos;
    };

    const cargarDatosAsync = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(productos);
            }, 300);
        });
    };

    const inicializarCatalogo = async () => {
        calcularAnioHistoria();
        
        try {
            const datosCargados = await cargarDatosAsync();
            renderizarCatalogo(datosCargados);
        } catch (error) {
            if (contenedorProductos) {
                contenedorProductos.innerHTML = `<p class="mensaje-vacio">Tuvimos un inconveniente al abrir el taller virtual. Por favor, recargá la página.</p>`;
            }
        }
    };

    // Búsqueda dinámica en el catálogo
    if (buscadorInput) {
        buscadorInput.addEventListener('input', (evento) => {
            const terminoBusqueda = evento.target.value.toLowerCase().trim();
            
            const productosFiltrados = productos.filter((prod) => {
                const material = (prod.especificaciones?.materiales || prod.especificaciones?.estructura || prod.material || '').toLowerCase();
                return prod.nombre.toLowerCase().includes(terminoBusqueda) || 
                       material.includes(terminoBusqueda);
            });
            
            renderizarCatalogo(productosFiltrados);
        });
    }

    // Scroll suave accesible en el botón "Explorar las piezas"
    if (btnVerCatalogo && contenedorProductos) {
        btnVerCatalogo.addEventListener('click', () => {
            const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            contenedorProductos.scrollIntoView({ 
                behavior: prefiereReducirMovimiento ? 'auto' : 'smooth', 
                block: 'start' 
            });
        });
    }

    // Interacción: Guardar producto seleccionado en LocalStorage y navegar a producto.html
    if (contenedorProductos) {
        contenedorProductos.addEventListener('click', (evento) => {
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

    // --------------------------------------------------------------------------
    // 4. Validación y Gestión del Formulario de Contacto
    // --------------------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const escaparHTML = (texto) => {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    };

    const marcarErrorCampo = (inputEl, errorEl, mensaje) => {
        if (!inputEl || !errorEl) return;
        inputEl.classList.add('campo-error');
        inputEl.setAttribute('aria-invalid', 'true');
        errorEl.textContent = mensaje;
        errorEl.classList.add('visible');
    };

    const limpiarErrorCampo = (inputEl, errorEl) => {
        if (!inputEl || !errorEl) return;
        inputEl.classList.remove('campo-error');
        inputEl.removeAttribute('aria-invalid');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    };

    const limpiarTodosLosErrores = () => {
        limpiarErrorCampo(inputNombre, errorNombre);
        limpiarErrorCampo(inputEmail, errorEmail);
        limpiarErrorCampo(textareaMensaje, errorMensaje);
        if (avisoContacto) {
            avisoContacto.textContent = '';
            avisoContacto.className = 'aviso-contacto';
        }
    };

    // Validación reactiva al escribir
    if (inputNombre) {
        inputNombre.addEventListener('input', () => {
            if (inputNombre.value.trim().length > 0) limpiarErrorCampo(inputNombre, errorNombre);
        });
    }

    if (inputEmail) {
        inputEmail.addEventListener('input', () => {
            const val = inputEmail.value.trim();
            if (val.length > 0 && emailRegex.test(val)) limpiarErrorCampo(inputEmail, errorEmail);
        });
    }

    if (textareaMensaje) {
        textareaMensaje.addEventListener('input', () => {
            if (textareaMensaje.value.trim().length > 0) limpiarErrorCampo(textareaMensaje, errorMensaje);
        });
    }

    // Envío del formulario
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarTodosLosErrores();

            const nombreValor = inputNombre ? inputNombre.value.trim() : '';
            const emailValor = inputEmail ? inputEmail.value.trim() : '';
            const mensajeValor = textareaMensaje ? textareaMensaje.value.trim() : '';

            let primerCampoInvalido = null;
            let formularioValido = true;

            if (nombreValor === '') {
                marcarErrorCampo(inputNombre, errorNombre, 'Por favor, ingresá tu nombre.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputNombre;
            }

            if (emailValor === '') {
                marcarErrorCampo(inputEmail, errorEmail, 'Por favor, ingresá tu correo electrónico.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputEmail;
            } else if (!emailRegex.test(emailValor)) {
                marcarErrorCampo(inputEmail, errorEmail, 'Ingresá un correo electrónico válido (ej: nombre@correo.com).');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputEmail;
            }

            if (mensajeValor === '') {
                marcarErrorCampo(textareaMensaje, errorMensaje, 'Por favor, escribí tu mensaje.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = textareaMensaje;
            }

            if (!formularioValido) {
                if (avisoContacto) {
                    avisoContacto.className = 'aviso-contacto aviso-error';
                    avisoContacto.textContent = 'Por favor, completá correctamente los campos antes de enviar.';
                    avisoContacto.focus();
                }
                if (primerCampoInvalido) primerCampoInvalido.focus();
            } else {
                if (avisoContacto) {
                    avisoContacto.className = 'aviso-contacto aviso-exito';
                    avisoContacto.innerHTML = `¡Gracias por contactarte, <strong>${escaparHTML(nombreValor)}</strong>! Recibimos tu consulta en el taller y te responderemos a la brevedad a <em>${escaparHTML(emailValor)}</em>.`;
                    avisoContacto.focus();
                }
                formContacto.reset();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 5. Inicialización Inicial
    // --------------------------------------------------------------------------
    inicializarCatalogo();

    // Detección de vista según hash en URL
    if (window.location.hash.toLowerCase() === '#catalogo') {
        navegarAVista('catalogo', false, false);
    } else {
        // En contacto.html por defecto o con #contacto, se activa el formulario
        navegarAVista('contacto', false, false);
    }
});

/**
 * Contacto - Hermanos Jota
 * Lógica para la planilla flotante modal de contacto superpuesta sobre el catálogo:
 * 1. Detección de click en el botón CONTACTO del menú superior.
 * 2. Despliegue del formulario como overlay modal centrado sobre el catálogo.
 * 3. Cierre con el botón "X", al hacer click fuera de la tarjeta (en el overlay) o con Escape.
 * 4. Validación de campos (Nombre, Email, Mensaje) y avisos de éxito/error.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Elementos del DOM
    // --------------------------------------------------------------------------
    const linkNavContacto = document.getElementById('link-nav-contacto');
    const modalContacto = document.getElementById('modal-contacto');
    const modalOverlay = document.getElementById('modal-overlay');
    const btnCerrarContacto = document.getElementById('btn-cerrar-contacto');
    const formContacto = document.getElementById('formulario-contacto');
    const avisoContacto = document.getElementById('aviso-contacto');

    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const textareaMensaje = document.getElementById('mensaje');

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    // --------------------------------------------------------------------------
    // 2. Control de Apertura y Cierre de la Planilla Flotante (Modal)
    // --------------------------------------------------------------------------
    const abrirModal = () => {
        if (!modalContacto) return;

        // Mostrar el modal superpuesto sobre el catálogo
        modalContacto.classList.remove('modal-contacto--oculto');
        modalContacto.setAttribute('aria-hidden', 'false');

        // Evitar desplazamiento de fondo mientras el modal está activo
        document.body.style.overflow = 'hidden';

        // Poner foco en el primer campo para accesibilidad
        if (inputNombre) {
            setTimeout(() => inputNombre.focus(), 50);
        }
    };

    const cerrarModal = () => {
        if (!modalContacto) return;

        // Ocultar modal
        modalContacto.classList.add('modal-contacto--oculto');
        modalContacto.setAttribute('aria-hidden', 'true');

        // Restaurar desplazamiento normal
        document.body.style.overflow = '';

        // Devolver foco al botón o enlace de contacto
        if (linkNavContacto) {
            linkNavContacto.focus();
        }
    };

    // Detectar click en el botón CONTACTO del menú superior
    if (linkNavContacto) {
        linkNavContacto.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal();
        });
    }

    // Escuchar cualquier otro enlace que apunte a #contacto
    document.querySelectorAll('a[href="#contacto"]').forEach((enlace) => {
        if (enlace !== linkNavContacto) {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                abrirModal();
            });
        }
    });

    // Cerrar con el botón "X"
    if (btnCerrarContacto) {
        btnCerrarContacto.addEventListener('click', (e) => {
            e.stopPropagation();
            cerrarModal();
        });
    }

    // Cerrar al hacer click en el overlay semitransparente (fuera de la tarjeta)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', cerrarModal);
    }

    // Cerrar al hacer click en el contenedor exterior del modal (fuera de la tarjeta)
    if (modalContacto) {
        modalContacto.addEventListener('click', (e) => {
            if (e.target === modalContacto) {
                cerrarModal();
            }
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContacto && !modalContacto.classList.contains('modal-contacto--oculto')) {
            cerrarModal();
        }
    });

    // Si la URL inicial contiene el hash #contacto, abrir la planilla flotante
    if (window.location.hash === '#contacto') {
        abrirModal();
    }

    // --------------------------------------------------------------------------
    // 3. Utilidades y Reglas de Validación
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

    // Validación reactiva mientras el usuario escribe
    if (inputNombre) {
        inputNombre.addEventListener('input', () => {
            if (inputNombre.value.trim().length > 0) {
                limpiarErrorCampo(inputNombre, errorNombre);
            }
        });
    }

    if (inputEmail) {
        inputEmail.addEventListener('input', () => {
            const valor = inputEmail.value.trim();
            if (valor.length > 0 && emailRegex.test(valor)) {
                limpiarErrorCampo(inputEmail, errorEmail);
            }
        });
    }

    if (textareaMensaje) {
        textareaMensaje.addEventListener('input', () => {
            if (textareaMensaje.value.trim().length > 0) {
                limpiarErrorCampo(textareaMensaje, errorMensaje);
            }
        });
    }

    // --------------------------------------------------------------------------
    // 4. Envío del Formulario y Notificaciones de Éxito / Error
    // --------------------------------------------------------------------------
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();

            limpiarTodosLosErrores();

            const nombreValor = inputNombre ? inputNombre.value.trim() : '';
            const emailValor = inputEmail ? inputEmail.value.trim() : '';
            const mensajeValor = textareaMensaje ? textareaMensaje.value.trim() : '';

            let primerCampoInvalido = null;
            let formularioValido = true;

            // Validación de Nombre
            if (nombreValor === '') {
                marcarErrorCampo(inputNombre, errorNombre, 'Por favor, ingresá tu nombre.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputNombre;
            }

            // Validación de Correo Electrónico
            if (emailValor === '') {
                marcarErrorCampo(inputEmail, errorEmail, 'Por favor, ingresá tu correo electrónico.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputEmail;
            } else if (!emailRegex.test(emailValor)) {
                marcarErrorCampo(inputEmail, errorEmail, 'Ingresá un correo electrónico válido (ej: nombre@correo.com).');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = inputEmail;
            }

            // Validación de Mensaje
            if (mensajeValor === '') {
                marcarErrorCampo(textareaMensaje, errorMensaje, 'Por favor, escribí tu mensaje.');
                formularioValido = false;
                if (!primerCampoInvalido) primerCampoInvalido = textareaMensaje;
            }

            // Resultado de la validación
            if (!formularioValido) {
                if (avisoContacto) {
                    avisoContacto.className = 'aviso-contacto aviso-error';
                    avisoContacto.textContent = 'Por favor, completá correctamente los campos requeridos antes de enviar.';
                }
                if (primerCampoInvalido) {
                    primerCampoInvalido.focus();
                }
            } else {
                if (avisoContacto) {
                    avisoContacto.className = 'aviso-contacto aviso-exito';
                    avisoContacto.innerHTML = `¡Gracias por contactarte, <strong>${escaparHTML(nombreValor)}</strong>! Recibimos tu consulta en el taller y te responderemos a la brevedad a <em>${escaparHTML(emailValor)}</em>.`;
                }

                // Resetear campos del formulario
                formContacto.reset();

                // Foco accesible al mensaje de confirmación
                avisoContacto.focus();
            }
        });
    }
});

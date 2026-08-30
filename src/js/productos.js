/**
 * Catálogo de Productos - Hermanos Jota
 * Lógica de renderizado dinámico, búsqueda interactiva y animaciones nativas.
 */

// 1. Datos de los productos (Catálogo)
const productos = [
    {
        id: "aparador-uspallata",
        nombre: "Aparador Uspallata",
        medidas: "180cm ancho x 80cm alto x 45cm prof.",
        material: "Madera de Algarrobo macizo (FSC)",
        acabado: "Aceite de lino natural",
        imagen: "Aparador Uspallata.png", // Modificado
        sustentable: true
    },
    {
        id: "biblioteca-recoleta",
        nombre: "Biblioteca Recoleta",
        medidas: "100cm ancho x 200cm alto x 35cm prof.",
        material: "Madera de Petiribí",
        acabado: "Tinte vegetal base agua",
        imagen: "Biblioteca Recoleta.png", // Modificado
        sustentable: false
    },
    {
        id: "butaca-mendoza",
        nombre: "Butaca Mendoza",
        medidas: "65cm ancho x 75cm alto x 70cm prof.",
        material: "Estructura de Caldén, tapizado en lino",
        acabado: "Aceite de lino natural",
        imagen: "Butaca Mendoza.png", // Modificado
        sustentable: true
    },
    {
        id: "sillon-copacabana",
        nombre: "Sillón Copacabana",
        medidas: "200cm ancho x 80cm alto x 85cm prof.",
        material: "Estructura de Quebracho blanco",
        acabado: "Barniz ecológico al agua",
        imagen: "Sillón Copacabana.png", // Modificado (Nota la tilde)
        sustentable: true
    },
    {
        id: "mesa-centro-araucaria",
        nombre: "Mesa de Centro Araucaria",
        medidas: "110cm ancho x 45cm alto x 60cm prof.",
        material: "Madera de Araucaria recuperada",
        acabado: "Cera de abejas natural",
        imagen: "Mesa de Centro Araucaria.png", // Modificado
        sustentable: true
    },
    {
        id: "mesa-noche-aconcagua",
        nombre: "Mesa de Noche Aconcagua",
        medidas: "45cm ancho x 55cm alto x 40cm prof.",
        material: "Madera de Algarrobo macizo",
        acabado: "Aceite de lino natural",
        imagen: "Mesa de Noche Aconcagua.png", // Modificado
        sustentable: false
    },
    {
        id: "sofa-patagonia",
        nombre: "Sofá Patagonia",
        medidas: "220cm ancho x 85cm alto x 90cm prof.",
        material: "Estructura de Lenga fueguina",
        acabado: "Tinte vegetal base agua",
        imagen: "Sofá Patagonia.png", // Modificado (Nota la tilde)
        sustentable: true
    },
    {
        id: "mesa-comedor-pampa",
        nombre: "Mesa Comedor Pampa",
        medidas: "200cm largo x 76cm alto x 100cm ancho",
        material: "Madera de Quebracho colorado (FSC)",
        acabado: "Aceite de lino y cera natural",
        imagen: "Mesa Comedor Pampa.png", // Modificado
        sustentable: true
    },
    {
        id: "sillas-cordoba",
        nombre: "Sillas Córdoba",
        medidas: "45cm ancho x 85cm alto x 50cm prof.",
        material: "Madera de Guatambú",
        acabado: "Laca poliuretánica al agua",
        imagen: "Sillas Córdoba.png", // Modificado (Nota la tilde)
        sustentable: false
    },
    {
        id: "escritorio-costa",
        nombre: "Escritorio Costa",
        medidas: "140cm ancho x 75cm alto x 60cm prof.",
        material: "Madera de Paraíso",
        acabado: "Aceite de lino natural",
        imagen: "Escritorio Costa.png", // Modificado
        sustentable: true
    },
    {
        id: "silla-trabajo-belgrano",
        nombre: "Silla de Trabajo Belgrano",
        medidas: "50cm ancho x 90cm alto x 55cm prof.",
        material: "Madera de Petiribí y cuero natural",
        acabado: "Cera de abejas",
        imagen: "Silla de Trabajo Belgrano.png", // Modificado
        sustentable: true
    }
];

// 2. Elementos del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const buscadorInput = document.getElementById('buscador-productos');
const spanAnio = document.getElementById('anio-actual');
const btnVerCatalogo = document.getElementById('btn-ver-catalogo');

// 3. Inicialización del año de historia (según Manual)
const calcularAnioHistoria = () => {
    if (spanAnio) {
        const anosHistoria = new Date().getFullYear() - 1960;
        spanAnio.textContent = `- ${anosHistoria} años de historia en la madera.`;
    }
};

// 4. Construcción HTML de las tarjetas
const crearTarjetaProducto = (producto) => {
    const urlImagen = `src/assets/images/${producto.imagen}`;
    // Requisito: dejar comentario si la imagen no existe
    const comentarioFaltaFoto = `<!-- FALTA: foto de ${producto.nombre}, plano general con luz cálida de tarde (${urlImagen}) -->`;
    
    const etiquetaSustentable = producto.sustentable 
        ? `<span class="etiqueta-sustentable" aria-label="Producto sustentable certificado FSC">Eco-friendly</span>` 
        : '';

    return `
        <article class="tarjeta-producto">
            <div class="contenedor-imagen">
                ${comentarioFaltaFoto}
                <img src="${urlImagen}" alt="${producto.nombre} fabricado en ${producto.material}" class="imagen-producto" loading="lazy">
                ${etiquetaSustentable}
            </div>
            <div class="info-producto">
                <h2 class="nombre-producto">${producto.nombre}</h2>
                <p class="detalle-producto"><strong>Material:</strong> ${producto.material}</p>
                <p class="detalle-producto"><strong>Medidas:</strong> ${producto.medidas}</p>
                <p class="detalle-producto"><strong>Acabado:</strong> ${producto.acabado}</p>
                <div class="contenedor-cta">
                    <a href="producto.html?id=${producto.id}" class="btn-primario">Sumalo a tu hogar</a>
                </div>
            </div>
        </article>
    `;
};

// 5. Renderizado del listado de productos
const renderizarCatalogo = (listaProductos) => {
    if (!contenedorProductos) return;

    if (listaProductos.length === 0) {
        // Microcopy siguiendo tono cálido de la marca
        contenedorProductos.innerHTML = `<p class="mensaje-vacio">Todavía no elegiste ninguna pieza. Están esperando en el taller.</p>`;
        return;
    }

    const htmlProductos = listaProductos.map(crearTarjetaProducto).join('');
    contenedorProductos.innerHTML = htmlProductos;
};

// 6. Carga asíncrona simulada de la API
const cargarDatosAsync = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos);
        }, 900); // 900ms para simular la petición de red
    });
};

// 7. Lógica principal de inicialización
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

// 8. Interacción: Búsqueda dinámica
if (buscadorInput) {
    buscadorInput.addEventListener('input', (evento) => {
        const terminoBusqueda = evento.target.value.toLowerCase().trim();
        
        const productosFiltrados = productos.filter((prod) => {
            return prod.nombre.toLowerCase().includes(terminoBusqueda) || 
                   prod.material.toLowerCase().includes(terminoBusqueda);
        });
        
        renderizarCatalogo(productosFiltrados);
    });
}

// 9. Interacción: Scroll Suave Accesible
const realizarScrollSuave = (elementoDestino) => {
    if (!elementoDestino) return;
    
    // Verificamos preferencia de movimiento reducido por accesibilidad
    const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefiereReducirMovimiento) {
        elementoDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        elementoDestino.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
};

if (btnVerCatalogo && contenedorProductos) {
    btnVerCatalogo.addEventListener('click', () => {
        realizarScrollSuave(contenedorProductos);
    });
}

// Disparador cuando el DOM está listo
document.addEventListener('DOMContentLoaded', inicializarCatalogo);

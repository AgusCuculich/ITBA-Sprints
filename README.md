# E-commerce Mueblería Hermanos Jota

Proyecto web desarrollado para la cursada de Desarrollo Web / ITBA Sprints 1 y 2.

## 👥 Integrantes

- Agustina Cuculich
- Delfina Lujan Moschella
- Rodrigo Antelo
- Marcos Gabriel Sánchez Matus

## 📖 Descripción de la Funcionalidad

El proyecto consiste en una plataforma web y catálogo digital para un emprendimiento de mobiliario de autor y diseño contemporáneo (**Hermanos Jota**). Ofrece una experiencia de navegación fluida, responsive y accesible orientada a la presentación de productos artesanales.

### Principales características y funcionalidades:
- **Página de Inicio (`index.html`)**: Presentación institucional con sección Hero, métricas destacadas, llamada a la acción y accesos directos al catálogo.
- **Catálogo de Productos (`productos.html`)**: Vista de grilla interactiva para explorar las distintas piezas disponibles con información de precios, materiales y categorías.
- **Detalle de Producto (`producto.html`)**: Vista detallada con galería de imágenes, especificaciones técnicas de materiales, medidas y opciones de compra o consulta.
- **Componentes Reutilizables (Web Components)**: Encabezado (`<hj-header>`) y pie de página (`<hj-footer>`) modulares para una experiencia consistente en todas las páginas.
- **Diseño Responsive & Accesible**: Adaptabilidad para dispositivos móviles, tablets y desktop, optimización de tipografías locales y estándares semánticos.

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica, accesibilidad y soporte para Web Components personalizados.
- **CSS3 (Vanilla)**:
  - Flexbox y CSS Grid para diagramación y layouts responsivos.
  - Variables CSS (Custom Properties) para tokens de diseño y paleta de colores.
  - Media queries para diseño *mobile-first* y adaptativo.
- **JavaScript (ES6+)**:
  - Módulos nativos (`type="module"`).
  - Web Components personalizados (Custom Elements) para componentes compartidos (header y footer).
  - Lógica dinámica de carga e interacción con el catálogo y vistas de detalle.
- **Git & GitHub Actions**: Control de versiones y flujo de integración/despliegue continuo (CI/CD) automatizado hacia **GitHub Pages**.

## 🚀 Despliegue

El sitio se encuentra configurado para desplegarse de manera automática mediante GitHub Actions en GitHub Pages desde el directorio `/src`.
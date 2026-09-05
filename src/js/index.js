import { productos } from './datos-productos.js';
import { crearTarjetaProducto, configurarSeleccionProducto } from './tarjeta-producto.js';

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return;

  // Tomamos los primeros 3 productos
  const destacados = productos ? productos.slice(0, 3) : [];

  contenedor.innerHTML = destacados.map(crearTarjetaProducto).join('');

  // Interacción: Guardar producto seleccionado en LocalStorage y navegar
  configurarSeleccionProducto(contenedor, productos);
});

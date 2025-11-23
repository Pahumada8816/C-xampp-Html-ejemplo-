/* ------------------ PESTAÑAS ------------------ */
function abrirSeccion(evt, nombre) {
  const tabs = document.querySelectorAll(".tabcontent");
  const botones = document.querySelectorAll(".tablink");
  tabs.forEach(t => t.classList.remove("active"));
  botones.forEach(b => b.classList.remove("active"));
  document.getElementById(nombre).classList.add("active");
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
  
  // Cerrar todos los submenús en móvil
  document.querySelectorAll('.submenu-container').forEach(container => {
    container.classList.remove('active');
  });

  // Cargar productos por categoría cuando se abre una sección
  if (nombre === 'dulceria') {
    cargarProductosPorCategoria('dulces', 'catalogoDulceria');
  } else if (nombre === 'cocteleria') {
    cargarProductosPorCategoria('cocteleria', 'catalogoCocteleria');
  } else if (nombre === 'postres') {
    cargarProductosPorCategoria('postres', 'catalogoPostres');
  } else if (nombre === 'pasteles') {
    cargarProductosPorCategoria('pasteles', 'catalogoPasteles');
  }
}

/* ------------------ TOGGLE SUBMENU EN MÓVIL ------------------ */
document.addEventListener('DOMContentLoaded', function() {
  const submenuContainers = document.querySelectorAll('.submenu-container');
  
  submenuContainers.forEach(container => {
    const button = container.querySelector('.tablink');
    if (button) {
      button.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
          e.stopPropagation();
          container.classList.toggle('active');
          
          // Cerrar otros submenús
          submenuContainers.forEach(other => {
            if (other !== container) {
              other.classList.remove('active');
            }
          });
        }
      });
    }
  });

  // Cargar productos iniciales
  cargarProductosPorCategoria('dulces', 'catalogoDulceria');
  cargarProductosPorCategoria('cocteleria', 'catalogoCocteleria');
  cargarProductosPorCategoria('postres', 'catalogoPostres');
  cargarProductosPorCategoria('pasteles', 'catalogoPasteles');
});

/* ------------------ CARGAR PRODUCTOS POR CATEGORÍA ------------------ */
function cargarProductosPorCategoria(categoria, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  // Si ya tiene productos, no volver a cargar
  if (contenedor.children.length > 0) return;

  const todosLosProductos = document.querySelectorAll("#catalogoProductos .producto");
  
  todosLosProductos.forEach(producto => {
    const cat = producto.dataset.categoria || "";
    if (cat.toLowerCase() === categoria.toLowerCase()) {
      const clon = producto.cloneNode(true);
      contenedor.appendChild(clon);
    }
  });

  // Si no hay productos en esa categoría
  if (contenedor.children.length === 0) {
    contenedor.innerHTML = '<p style="text-align: center; padding: 40px; font-size: 1.2rem; color: #666;">No hay productos disponibles en esta categoría por el momento.</p>';
  }
}

/* ------------------ FILTRADO DE TEMPORADA ------------------ */
function filtrarTemporada(nombre) {
  const items = document.querySelectorAll("#catalogoTemporada .temporada");
  items.forEach(it => {
    const t = it.dataset.temporada || "";
    it.style.display = (t === nombre) ? "" : "none";
  });
}

function mostrarTodosTemporada() {
  const items = document.querySelectorAll("#catalogoTemporada .temporada");
  items.forEach(it => {
    it.style.display = "";
  });
}

/* ------------------ CARRITO DE COMPRAS ------------------ */
const carrito = [];
const listaCarrito = document.getElementById("listaCarrito");
const totalDisplay = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciarBtn");
const enviarBtn = document.getElementById("enviarBtn");

// Evento al hacer click en "Añadir"
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-cart")) {
    const productoElement = e.target.closest(".producto, .oferta, .temporada");
    const nombre = e.target.dataset.nombre;
    const precio = parseInt(e.target.dataset.precio);
    const cantidad = parseInt(productoElement.querySelector(".qty").value) || 1;

    agregarAlCarrito(nombre, precio, cantidad);
    actualizarCarrito();
  }
});

function agregarAlCarrito(nombre, precio, cantidad) {
  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index > -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    li.innerHTML = `
      (${item.cantidad}x) ${item.nombre} - $${subtotal.toLocaleString('es-CL')}
      <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; cursor: pointer; color: red;">❌</button>
    `;
    listaCarrito.appendChild(li);
  });

  totalDisplay.textContent = `Total: $${total.toLocaleString('es-CL')}`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

vaciarBtn.addEventListener("click", () => {
  carrito.length = 0;
  actualizarCarrito();
});

enviarBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío. Por favor, añade algunos productos.");
    return;
  }

  const mensaje = carrito.map(item => {
    const subtotal = item.precio * item.cantidad;
    return `(${item.cantidad}x) ${item.nombre} - $${subtotal.toLocaleString('es-CL')}`;
  }).join('\\n');

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const mensajeFinal = `Hola, me gustaría hacer un pedido:\\n\\n${mensaje}\\n\\nTotal a pagar: $${total.toLocaleString('es-CL')}`;

  const numeroWhatsApp = "+56999335740";
  const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeFinal)}`;

  window.open(url, '_blank');
});

// Inicializar el carrito
actualizarCarrito();

// ------------------ MODAL SUGERENCIAS Y VALORACIONES ------------------
const modal = document.getElementById("modalSugerencia");
const btnSugerencias = document.getElementById("btnSugerencias");
const cerrarModal = document.getElementById("cerrarModal");
const stars = document.getElementById("stars");
const enviarValoracionBtn = document.getElementById("enviarValoracion");

let calValor = 0;

function highlightStars(rating) {
  const allStars = stars.querySelectorAll('span');
  allStars.forEach((star, index) => {
    star.textContent = index < rating ? '★' : '☆';
    star.classList.toggle('active', index < rating);
  });
}

stars.addEventListener('click', (e) => {
  if (e.target.tagName === 'SPAN') {
    calValor = parseInt(e.target.dataset.value);
    highlightStars(calValor);
  }
});

btnSugerencias.onclick = function() {
  modal.style.display = "flex";
  if (calValor > 0) highlightStars(calValor);
}

cerrarModal.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Lógica de envío de valoración (sin backend, usa localStorage)
enviarValoracionBtn.addEventListener("click", () => {
  if (calValor === 0) {
    alert("Por favor, selecciona una calificación (estrellas).");
    return;
  }

  const nombre = document.getElementById("inputNombre").value || "Cliente Anónimo";
  const comentario = document.getElementById("inputComentario").value;
  const fecha = new Date().toLocaleDateString('es-CL');
  const reseña = { nombre, cal: calValor, comentario, fecha };
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  reseñas.unshift(reseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputComentario").value = "";
  calValor = 0;
  highlightStars(0);
  renderValoraciones();
  alert("Gracias por tu valoración ✨");
  modal.style.display = "none";
});

// Valoraciones en la sección valoraciones
const vStars = document.getElementById("v-stars");
const vEnviarBtn = document.getElementById("v-enviar");
let vCalValor = 0;

function highlightVStars(rating) {
  const allStars = vStars.querySelectorAll('span');
  allStars.forEach((star, index) => {
    star.textContent = index < rating ? '★' : '☆';
    star.classList.toggle('active', index < rating);
  });
}

vStars.addEventListener('click', (e) => {
  if (e.target.tagName === 'SPAN') {
    vCalValor = parseInt(e.target.dataset.value);
    highlightVStars(vCalValor);
  }
});

vEnviarBtn.addEventListener("click", () => {
  if (vCalValor === 0) {
    alert("Por favor, selecciona una calificación (estrellas).");
    return;
  }

  const nombre = document.getElementById("v-nombre").value || "Cliente Anónimo";
  const comentario = document.getElementById("v-comentario").value;
  const fecha = new Date().toLocaleDateString('es-CL');
  const reseña = { nombre, cal: vCalValor, comentario, fecha };
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  reseñas.unshift(reseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  document.getElementById("v-nombre").value = "";
  document.getElementById("v-comentario").value = "";
  vCalValor = 0;
  highlightVStars(0);
  renderValoraciones();
  alert("Gracias por tu valoración ✨");
});

// renderizar valoraciones
function renderValoraciones() {
  const lista = document.getElementById("listaValoraciones");
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  lista.innerHTML = "";
  if (!lista) return;
  if (reseñas.length === 0) {
    lista.innerHTML = "<li>No hay valoraciones todavía.</li>";
    return;
  }
  reseñas.forEach(r => {
    const li = document.createElement("li");
    const stars = "★".repeat(r.cal) + "☆".repeat(5 - r.cal);
    li.innerHTML = `<div class="meta">${r.nombre} · <small>${r.fecha}</small> · <span style="color:#ffb400">${stars}</span></div>
                    <div class="coment">${r.comentario || "<i>Sin comentario</i>"}</div>`;
    lista.appendChild(li);
  });
}

renderValoraciones();

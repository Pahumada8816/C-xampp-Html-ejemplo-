/* ------------------ PESTAÑAS ------------------ */
function abrirSeccion(evt, nombre) {
  const tabs = document.querySelectorAll(".tabcontent");
  const botones = document.querySelectorAll(".tablink");
  tabs.forEach(t => t.classList.remove("active"));
  botones.forEach(b => b.classList.remove("active"));
  document.getElementById(nombre).classList.add("active");
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
}

/* ------------------ FILTRADO (submenus) ------------------ */
function filtrar(categoria) {
  abrirSeccion({ currentTarget: document.querySelector(".tablink[onclick*='productos']") }, 'productos');
  // Se ha cambiado el selector para incluir todos los artículos del catálogo de productos
  const items = document.querySelectorAll("#catalogoProductos article");
  
  items.forEach(it => {
    const cat = it.dataset.categoria || "";
    // Comprobar si coincide la categoría O si se quiere mostrar todo (categoria vacía/nula)
    if (cat === categoria || categoria === "") {
        it.style.display = ""; // Mostrar
    } else {
        it.style.display = "none"; // Ocultar
    }
  });
}

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
/* >>>   FUNCIÓN MODIFICADA TAL COMO PEDISTE — SOLO ESTA   <<< */
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
function filtrarTemporada(nombre) {
  abrirSeccion({ currentTarget: document.querySelector(".tablink") }, 'temporada');
  const items = document.querySelectorAll("#catalogoTemporada .temporada, #catalogoTemporada .producto");
  items.forEach(it => {
    const t = it.dataset.temporada || "";
    it.style.display = (t === nombre) ? "" : "none";
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

  // Se ha eliminado el código que ocultaba el carrito si estaba vacío.
  // El carrito ahora será visible siempre según el estilo de CSS.
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

  // Número de WhatsApp (ejemplo, debes reemplazarlo)
  const numeroWhatsApp = "+56999335740";
  const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensajeFinal)}`;

  window.open(url, '_blank');
});

// Inicializar el carrito (ahora visible siempre)
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
  // Opcional: Centrar las estrellas al abrir
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
  modal.style.display = "none"; // Ocultar después de enviar
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

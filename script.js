/* ------------------ PESTAÑAS - CORRECCIÓN CLAVE ------------------ */
function abrirSeccion(evt, nombre) {
  // 1. Oculta todos los contenidos de pestañas
  const tabs = document.querySelectorAll(".tabcontent");
  tabs.forEach(t => t.classList.remove("active"));
  
  // 2. Desactiva todos los botones tablink (limpia el estado)
  const botones = document.querySelectorAll(".menu > .tablink, .submenu-container > .tablink");
  botones.forEach(b => b.classList.remove("active"));
  
  // 3. Muestra la pestaña solicitada
  const targetTab = document.getElementById(nombre);
  if (targetTab) targetTab.classList.add("active");
  
  // 4. Activa el botón que disparó el evento (si existe, es decir, si es un clic directo)
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  } else {
    // Si la llamada es desde filtrar (evt es null), activa el botón principal de esa sección (Productos o Temporada)
    const defaultButton = document.querySelector(`.menu button[onclick*="'${nombre}'"]`);
    if (defaultButton) defaultButton.classList.add("active");
  }
}

/* ------------------ FILTRADO (submenus) - CORRECCIÓN CLAVE ------------------ */
function filtrar(categoria) {
  // Abre la sección 'productos' usando null como evento para que abrirSeccion active el botón principal
  abrirSeccion(null, 'productos'); 
  
  const items = document.querySelectorAll("#catalogoProductos .producto");
  items.forEach(it => {
    const cat = it.dataset.categoria || "";
    it.style.display = (cat === categoria || categoria === "") ? "" : "none";
  });
}

function filtrarTemporada(nombre) {
  // Abre la sección 'temporada' usando null como evento para que abrirSeccion active el botón principal
  abrirSeccion(null, 'temporada');
  
  const items = document.querySelectorAll("#catalogoTemporada .temporada, #catalogoTemporada .producto");
  items.forEach(it => {
    const t = it.dataset.temporada || "";
    it.style.display = (t === nombre || nombre === "") ? "" : "none";
  });
}


/* ------------------ CARRITO ------------------ */
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarritoDOM() {
  const lista = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("total");
  lista.innerHTML = "";
  let total = 0;
  if (!lista) return;
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="flex:1">
        <strong>${item.nombre}</strong><br>
        <small>${item.cantidad} × $${item.precio}</small>
      </div>
      <div style="text-align:right">
        <div>$${item.precio * item.cantidad}</div>
        <div style="margin-top:6px">
          <button onclick="cambiarCantidad(${index}, -1)" style="margin-right:6px">−</button>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
        </div>
      </div>
    `;
    lista.appendChild(li);
    total += item.precio * item.cantidad;
  });
  totalEl.textContent = `Total: $${total}`;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad < 1) carrito.splice(index,1);
  actualizarCarritoDOM();
}

function agregarAlCarritoNombrePrecio(nombre, precio, cantidad = 1) {
  const idx = carrito.findIndex(i => i.nombre === nombre && i.precio == precio);
  if (idx >= 0) {
    carrito[idx].cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio: Number(precio), cantidad: Number(cantidad) });
  }
  actualizarCarritoDOM();
}

document.querySelectorAll(".add-cart").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const nombre = btn.dataset.nombre;
    const precio = Number(btn.dataset.precio);
    const qtyInput = btn.closest(".producto, .oferta, .temporada").querySelector(".qty");
    const cantidad = qtyInput ? Math.max(1, Number(qtyInput.value)) : 1;
    agregarAlCarritoNombrePrecio(nombre, precio, cantidad);
  });
});

/* vaciar y enviar */
const vaciarBtn = document.getElementById("vaciarBtn");
if (vaciarBtn) vaciarBtn.addEventListener("click", ()=>{
  carrito = [];
  actualizarCarritoDOM();
});

/* Enviar pedido a WhatsApp (solo suma de productos) */
const enviarBtn = document.getElementById("enviarBtn");
if (enviarBtn) enviarBtn.addEventListener("click", ()=>{
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. ¡Añade algunos productos primero!");
    return;
  }
  let mensaje = "¡Hola! Quisiera hacer el siguiente pedido:%0A%0A";
  carrito.forEach(it => {
    mensaje += `*${it.nombre}* — ${it.cantidad} x $${it.precio} = $${it.cantidad * it.precio}%0A`;
  });
  const total = carrito.reduce((s,i)=>s + (i.precio * i.cantidad), 0);
  mensaje += `%0A*Total:* $${total}`;
  const url = `https://wa.me/56999335740?text=${mensaje}`;
  window.open(url, "_blank");
});

/* inicializar carrito en DOM */
actualizarCarritoDOM();

/* ------------------ VALORACIONES / SUGERENCIAS ------------------ */

// Modal quick-suggest
const btnSugerencias = document.getElementById("btnSugerencias");
const modal = document.getElementById("modalSugerencia");
const cerrarModalBtn = document.getElementById("cerrarModal");

if (btnSugerencias) btnSugerencias.addEventListener("click", ()=> modal.style.display = "flex");
if (cerrarModalBtn) cerrarModalBtn.addEventListener("click", ()=> modal.style.display = "none");
window.addEventListener("click", (e)=> {
  if (e.target === modal) modal.style.display = "none";
});

// Estrellas del modal (quick-suggest)
let calificacionModal = 0;
const starsModal = document.querySelectorAll("#stars span");

function highlightStarsModal(value) {
  starsModal.forEach(s => {
    s.classList.remove("active");
    if (Number(s.dataset.value) <= value) {
      s.classList.add("active");
    }
  });
}

starsModal.forEach(s => {
  s.addEventListener("click", ()=> {
    calificacionModal = Number(s.dataset.value);
    highlightStarsModal(calificacionModal);
  });
  s.addEventListener("mouseenter", ()=> highlightStarsModal(Number(s.dataset.value)));
  s.addEventListener("mouseleave", ()=> highlightStarsModal(calificacionModal));
});


// Estrellas de la sección (valoraciones)
let calValor = 0;
const starsSeccion = document.querySelectorAll("#starsSeccion span");

function highlightStarsSeccion(value) {
  starsSeccion.forEach(s => {
    s.classList.remove("active");
    if (Number(s.dataset.value) <= value) {
      s.classList.add("active");
    }
  });
}

starsSeccion.forEach(s => {
  s.addEventListener("click", ()=> {
    calValor = Number(s.dataset.value);
    highlightStarsSeccion(calValor);
  });
  s.addEventListener("mouseenter", ()=> highlightStarsSeccion(Number(s.dataset.value)));
  s.addEventListener("mouseleave", ()=> highlightStarsSeccion(calValor));
});


// lógica de envío (ambos botones comparten la misma lógica para guardar en localStorage)
function guardarReseña(nombreId, comentarioId, calificacion) {
  const nombre = document.getElementById(nombreId).value || "Anónimo";
  const comentario = document.getElementById(comentarioId).value;
  const cal = calificacion;
  
  if (cal === 0) {
    alert("Por favor, selecciona una calificación.");
    return false;
  }
  
  const fecha = new Date().toLocaleDateString('es-CL');
  const reseña = { nombre, cal, comentario, fecha };
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  reseñas.unshift(reseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  
  document.getElementById(nombreId).value = "";
  document.getElementById(comentarioId).value = "";
  
  return true;
}

// Botón del Modal (Quick-Suggest)
const enviarValoracionModal = document.getElementById("enviarValoracion");
if (enviarValoracionModal) enviarValoracionModal.addEventListener("click", ()=>{
  if (guardarReseña('inputNombre', 'inputComentario', calificacionModal)) {
    calificacionModal = 0;
    highlightStarsModal(0);
    renderValoraciones();
    modal.style.display = "none";
    alert("Gracias por tu sugerencia/valoración ✨");
  }
});


// Botón de la Sección (Valoraciones)
const enviarValoracionSeccion = document.getElementById("enviarValoracionSeccion");
if (enviarValoracionSeccion) enviarValoracionSeccion.addEventListener("click", ()=>{
  if (guardarReseña('v-nombre', 'v-comentario', calValor)) {
    calValor = 0;
    highlightStarsSeccion(0);
    renderValoraciones();
    alert("Gracias por tu valoración ✨");
  }
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

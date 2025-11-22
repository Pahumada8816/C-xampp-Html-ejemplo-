/* ------------------ PESTAÑAS ------------------ */
function abrirSeccion(evt, nombre) {
  // 1. Oculta todos los contenidos de pestañas
  const tabs = document.querySelectorAll(".tabcontent");
  tabs.forEach(t => t.classList.remove("active"));
  
  // 2. Desactiva todos los botones tablink (limpia el estado)
  const botones = document.querySelectorAll(".tablink");
  botones.forEach(b => b.classList.remove("active"));
  
  // 3. Muestra la pestaña solicitada
  const targetTab = document.getElementById(nombre);
  if (targetTab) targetTab.classList.add("active");
  
  // 4. Activa el botón que disparó el evento (solo si viene de un clic real)
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  } else {
    // Si la llamada es desde filtrar (evt es null), activa el botón de la sección
    const defaultButton = document.querySelector(`.menu button[onclick*="'${nombre}'"]`);
    if (defaultButton) defaultButton.classList.add("active");
  }
}

/* ------------------ FILTRADO (submenus) - CORRECCIÓN CLAVE ------------------ */
function filtrar(categoria) {
  // CORRECCIÓN: Se abre la sección 'productos' pasando null como evento.
  // Esto evita que JS active incorrectamente el primer botón de la lista,
  // resolviendo el problema de maquetación al filtrar.
  abrirSeccion(null, 'productos'); 
  
  const items = document.querySelectorAll("#catalogoProductos .producto");
  items.forEach(it => {
    const cat = it.dataset.categoria || "";
    it.style.display = (cat === categoria || categoria === "") ? "" : "none";
  });
}

function filtrarTemporada(nombre) {
  // CORRECCIÓN: Se abre la sección 'temporada' pasando null como evento.
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
    const qtyInput = btn.closest(".producto").querySelector(".qty");
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
  if (carrito.length === 0) { alert("Tu carrito está vacío."); return; }
  let mensaje = "🛍 Pedido desde catálogo:%0A%0A";
  carrito.forEach((it, i) => {
    mensaje += `${i+1}. ${it.nombre} — ${it.cantidad} x $${it.precio} = $${it.cantidad * it.precio}%0A`;
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
window.addEventListener("click", (e)=> { if (e.target === modal) modal.style.display = "none"; });

// estrellas del modal
let calificacionActual = 0;
const starsModal = document.querySelectorAll("#stars span");
starsModal.forEach(s => {
  s.addEventListener("mouseenter", ()=> {
    const v = Number(s.dataset.value);
    highlightStarsModal(v);
  });
  s.addEventListener("mouseleave", ()=> highlightStarsModal(calificacionActual));
  s.addEventListener("click", ()=> {
    calificacionActual = Number(s.dataset.value);
    highlightStarsModal(calificacionActual);
  });
});

function highlightStarsModal(v) {
  starsModal.forEach(s => {
    s.classList.toggle("active", Number(s.dataset.value) <= v);
  });
}

// enviar valoración desde modal
const enviarValoracionBtn = document.getElementById("enviarValoracion");
if (enviarValoracionBtn) enviarValoracionBtn.addEventListener("click", ()=>{
  const nombre = document.getElementById("inputNombre").value.trim() || "Anónimo";
  const comentario = document.getElementById("inputComentario").value.trim() || "";
  const cal = calificacionActual || 0;
  const fecha = new Date().toLocaleString();
  if (cal === 0 && comentario === "") {
    alert("Por favor deja una calificación o comentario.");
    return;
  }
  const reseña = { nombre, cal, comentario, fecha };
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  reseñas.unshift(reseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  modal.style.display = "none";
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputComentario").value = "";
  calificacionActual = 0;
  highlightStarsModal(0);
  renderValoraciones();
  alert("Gracias por tu valoración ✨");
});

// estrellas en sección Valoraciones
let calValor = 0;
const starsSeccion = document.querySelectorAll("#v-stars span");
if (starsSeccion) {
  starsSeccion.forEach(s => {
    s.addEventListener("mouseenter", ()=>{
      const v = Number(s.dataset.value);
      highlightStarsSeccion(v);
    });
    s.addEventListener("mouseleave", ()=> highlightStarsSeccion(calValor));
    s.addEventListener("click", ()=>{
      calValor = Number(s.dataset.value);
      highlightStarsSeccion(calValor);
    });
  });
}

function highlightStarsSeccion(v) {
  const s = document.querySelectorAll("#v-stars span");
  s.forEach(st => st.classList.toggle("active", Number(st.dataset.value) <= v));
}

// enviar desde sección Valoraciones
const vEnviar = document.getElementById("v-enviar");
if (vEnviar) vEnviar.addEventListener("click", ()=>{
  const nombre = document.getElementById("v-nombre").value.trim() || "Anónimo";
  const comentario = document.getElementById("v-comentario").value.trim() || "";
  const cal = calValor || 0;
  const fecha = new Date().toLocaleString();
  if (cal === 0 && comentario === "") { alert("Por favor deja una calificación o comentario."); return; }
  const reseña = { nombre, cal, comentario, fecha };
  const reseñas = JSON.parse(localStorage.getItem("reseñas")) || [];
  reseñas.unshift(reseña);
  localStorage.setItem("reseñas", JSON.stringify(reseñas));
  document.getElementById("v-nombre").value = "";
  document.getElementById("v-comentario").value = "";
  calValor = 0;
  highlightStarsSeccion(0);
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

/* ------------------ Utilidades pequeñas ------------------ */
window.addEventListener("DOMContentLoaded", ()=> {
  // Inicializa la primera pestaña activa al cargar la página si no hay otra activa.
  const firstActiveTab = document.querySelector(".tablink.active");
  if (!firstActiveTab) {
    const t = document.querySelector(".tablink");
    // Se llama a abrirSeccion con el primer botón y su contenido, si no hay uno activo.
    if (t) abrirSeccion({ currentTarget: t }, 'productos'); 
  } else {
    // Si ya hay un botón activo en el HTML, asegura que el contenido se muestre al cargar.
    const targetNameMatch = firstActiveTab.getAttribute('onclick').match(/'([^']*)'/);
    if (targetNameMatch && targetNameMatch[1]) {
        document.getElementById(targetNameMatch[1]).classList.add("active");
    }
  }
});

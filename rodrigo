<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Catálogo | WhatsApp Store</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <header>
    <h1>Bienvenido a nuestro catálogo</h1>
    <p>Descubre productos únicos y contáctanos directamente por WhatsApp 📱</p>
  </header>

  <!-- Catálogo -->
  <section class="catalogo">
    <div class="producto">
      <img src="../imagenes/01_1.jpg" alt="Barra Energética Natural">
      <h3>Barra Energética Natural</h3>
      <p>Base de avena, miel y frutos secos.<br>180 kcal</p>
      <p class="precio">$1.200</p>
      <button class="btn" onclick="agregarAlCarrito('Barra Energética Natural', 1200)">Añadir al carrito</button>
    </div>

    <div class="producto">
      <img src="../imagenes/01_2.jpg" alt="ChocoCoco Fit">
      <h3>ChocoCoco Fit</h3>
      <p>Chocolate con almendra y coco.<br>220 kcal</p>
      <p class="precio">$1.500</p>
      <button class="btn" onclick="agregarAlCarrito('ChocoCoco Fit', 1500)">Añadir al carrito</button>
    </div>

    <div class="producto">
      <img src="../imagenes/01_3.jpg" alt="Protein Bar">
      <h3>Protein Bar</h3>
      <p>Proteína, avena y miel.<br>200 kcal</p>
      <p class="precio">$1.300</p>
      <button class="btn" onclick="agregarAlCarrito('Protein Bar', 1300)">Añadir al carrito</button>
    </div>
  </section>

  <!-- Carrito -->
  <div id="carrito">
    <h2>🛒 Carrito de compras</h2>
    <ul id="listaCarrito"></ul>
    <p id="total">Total: $0</p>
    <div class="acciones">
      <button class="btn" onclick="vaciarCarrito()">Vaciar carrito</button>
      <button class="btn enviar" onclick="enviarPedido()">Enviar pedido por WhatsApp</button>
    </div>
  </div>

  <!-- Botón de WhatsApp flotante -->
  <a href="https://wa.me/56999335740" target="_blank" class="btn-whatsapp">💬 Chat directo</a>

  <footer>
    <p>© 2025 Catálogo Online | Desarrollado con ❤️</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>

// Script simple para carrito visual con tipos explícitos en TypeScript

// Declaración del carrito con tipo array de strings
let carrito: string[] = [];

// Función para agregar un producto al carrito
function agregarAlCarrito(producto: string): void {
  carrito.push(producto);
  actualizarCarrito();
}

// Función que actualiza visualmente el carrito en la interfaz
function actualizarCarrito(): void {
  const lista = document.getElementById("listaCarrito") as HTMLUListElement | null;
  const carritoDiv = document.getElementById("carrito") as HTMLDivElement | null;

  if (!lista || !carritoDiv) return; // Evita errores si no existen los elementos

  lista.innerHTML = "";

  carrito.forEach((item: string, index: number) => {
    const li: HTMLLIElement = document.createElement("li");
    li.textContent = item;
    li.style.cursor = "pointer";
    li.onclick = (): void => eliminarDelCarrito(index);
    lista.appendChild(li);
  });

  if (carrito.length > 0) {
    carritoDiv.classList.add("visible");
  } else {
    carritoDiv.classList.remove("visible");
  }
}

// Elimina un producto del carrito según su índice
function eliminarDelCarrito(index: number): void {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Vacía completamente el carrito
function vaciarCarrito(): void {
  carrito = [];
  actualizarCarrito();
}

// Solo para depuración
console.log("Script de carrito cargado correctamente ✅");

body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  background-color: #f8f9fa;
  color: #333;
}

header {
  text-align: center;
  padding: 2rem;
  background: #25D366;
  color: white;
}

.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.producto {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  padding: 1rem;
  transition: transform 0.2s;
}

.producto:hover {
  transform: scale(1.03);
}

.producto img {
  width: 100%;
  border-radius: 10px;
  height: 180px;
  object-fit: cover;
}

.precio {
  font-size: 1.1rem;
  font-weight: bold;
  color: #25D366;
}

.btn {
  background-color: #25D366;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background-color: #1ebe5b;
}

#carrito {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

#carrito ul {
  list-style: none;
  padding: 0;
}

#carrito li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

#carrito li span {
  color: #888;
}

.acciones {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-whatsapp {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25D366;
  color: white;
  text-decoration: none;
  padding: 14px 20px;
  border-radius: 50px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: 0.3s;
}

.btn-whatsapp:hover {
  background-color: #1ebe5b;
}

footer {
  text-align: center;
  padding: 1rem;
  background: #e9ecef;
  margin-top: 2rem;
}

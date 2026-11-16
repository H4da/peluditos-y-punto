/* =========================================================
   Carrito: tabla de productos, cantidades, quitar y totales
   Requiere productos.js cargado antes que este archivo.

   El carrito usa los 2 productos de ejemplo.
   ========================================================= */
(function () {
  const ENVIO = 15000;       // envío estimado fijo (ejemplo)
  const CANTIDAD_MAXIMA = 99;

  // El carrito se guarda en el navegador (js/carrito-store.js)
  let carrito = PPCarrito.leer();
  const guardar = function () { PPCarrito.guardar(carrito); };

  const porId = function (id) { return document.getElementById(id); };
  const dinero = function (valor) { return "$" + valor.toLocaleString("es-CO"); };
  const esc = function (t) {
    return String(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  const producto = function (item) {
    return productos.find(function (p) { return p.id === item.id; });
  };

  
  const variantes = function (item) {
    const partes = [];
    if (item.color) partes.push("Color: " + item.color.charAt(0).toUpperCase() + item.color.slice(1));
    if (item.talla) partes.push("Talla: " + item.talla);
    if (item.texto) partes.push("Texto: “" + item.texto + "”");
    if (item.imagen) partes.push("Foto: " + item.imagen);
    return partes.join(" | ");
  };

  const iconoBasura =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  function dibujar() {
    const filas = porId("carrito-filas");
    const vacio = carrito.length === 0;

    filas.innerHTML = carrito.map(function (item, i) {
      const p = producto(item);
      if (!p) return "";
      const total = p.precio * item.cantidad;
      return (
        '<tr>' +
          '<td class="cell-product" data-label="Producto">' +
            '<a href="producto-pod.html?id=' + p.id + '" class="cart-thumb">' +
              '<img src="' + esc(p.imagenes[0]) + '" alt="' + esc(p.nombre) + '"></a>' +
            '<div class="cart-info">' +
              '<a href="producto-pod.html?id=' + p.id + '" class="cart-name">' + esc(p.nombre) + '</a>' +
              '<p class="cart-variants">' + esc(variantes(item)) + '</p>' +
              '<button type="button" class="btn-remove" data-accion="quitar" data-i="' + i + '">' +
                iconoBasura + ' Quitar</button>' +
            '</div>' +
          '</td>' +
          '<td class="cell-price" data-label="Precio">' + dinero(p.precio) + '</td>' +
          '<td class="cell-qty" data-label="Cantidad">' +
            '<div class="qty">' +
              '<button type="button" data-accion="menos" data-i="' + i + '" aria-label="Disminuir cantidad de ' + esc(p.nombre) + '">&minus;</button>' +
              '<span class="qty-value">' + item.cantidad + '</span>' +
              '<button type="button" data-accion="mas" data-i="' + i + '" aria-label="Aumentar cantidad de ' + esc(p.nombre) + '">+</button>' +
            '</div>' +
          '</td>' +
          '<td class="cell-total" data-label="Total">' + dinero(total) + '</td>' +
        '</tr>'
      );
    }).join("");

    // Totales
    const subtotal = carrito.reduce(function (suma, item) {
      const p = producto(item);
      return suma + (p ? p.precio * item.cantidad : 0);
    }, 0);
    const envio = vacio ? 0 : ENVIO;

    porId("resumen-subtotal").textContent = dinero(subtotal);
    porId("resumen-envio").textContent = dinero(envio);
    porId("resumen-total").textContent = dinero(subtotal + envio);

    // Estado vacío
    document.querySelector(".cart-table").style.display = vacio ? "none" : "";
    porId("carrito-vacio").hidden = !vacio;
    const boton = porId("btn-finalizar");
    boton.classList.toggle("is-disabled", vacio);
    boton.setAttribute("aria-disabled", vacio ? "true" : "false");
  }

  // Un solo escuchador para los botones de la tabla
  porId("carrito-filas").addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;

    const i = Number(boton.dataset.i);
    const accion = boton.dataset.accion;

    if (accion === "mas" && carrito[i].cantidad < CANTIDAD_MAXIMA) carrito[i].cantidad++;
    if (accion === "menos" && carrito[i].cantidad > 1) carrito[i].cantidad--;
    if (accion === "quitar") carrito.splice(i, 1);

    guardar();
    dibujar();
  });

  // Con el carrito vacío, "Finalizar Compra" no avanza
  porId("btn-finalizar").addEventListener("click", function (e) {
    if (carrito.length === 0) e.preventDefault();
  });

  dibujar();
})();
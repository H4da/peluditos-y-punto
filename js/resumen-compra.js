/* Resumen del pedido en finalizar-compra.html: lee el carrito guardado.
   Requiere productos.js y carrito-store.js antes. Solo maquetación. */
(function () {
  var ENVIO = 15000;
  var cont = document.querySelector(".summary-items");
  var filas = document.querySelector(".summary dl");
  var form = document.getElementById("checkoutForm");
  if (!cont || !filas || !form) return;

  var dinero = function (v) { return "$" + v.toLocaleString("es-CO"); };
  var esc = function (t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };
  var cap = function (t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; };

  var carrito = PPCarrito.leer().filter(function (i) { return productos.some(function (p) { return p.id === i.id; }); });
  var sub = 0;
  cont.innerHTML = carrito.map(function (i) {
    var p = productos.find(function (x) { return x.id === i.id; });
    var linea = p.precio * i.cantidad; sub += linea;
    var meta = [i.color && "Color: " + cap(i.color), i.talla && "Talla: " + i.talla, i.texto && "Texto: “" + i.texto + "”", "Cant. " + i.cantidad].filter(Boolean).join(" | ");
    return '<div class="summary-item"><img src="' + esc(p.imagenes[0]) + '" alt=""><div><p class="summary-item-name">' + esc(p.nombre) + '</p>' +
      '<p class="summary-item-meta">' + esc(meta) + '</p></div><p class="summary-item-price">' + dinero(linea) + '</p></div>';
  }).join("");

  var vacio = carrito.length === 0;
  if (vacio) cont.innerHTML = '<p style="padding:8px 0">Tu carrito está vacío. <a href="tienda-pod.html" style="text-decoration:underline">Ver productos</a></p>';
  var envio = vacio ? 0 : ENVIO;
  var dds = filas.querySelectorAll("dd");
  dds[0].textContent = dinero(sub); dds[1].textContent = dinero(envio); dds[3].textContent = dinero(sub + envio);

  var btn = form.querySelector(".btn-pay");
  if (vacio) { btn.disabled = true; btn.style.opacity = ".5"; btn.style.cursor = "not-allowed"; }
  // Al finalizar la orden (demo) se vacía el carrito
  form.addEventListener("submit", function () { PPCarrito.vaciar(); });
})();

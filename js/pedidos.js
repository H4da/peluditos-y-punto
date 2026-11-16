/* Historial y detalle de pedidos. Requiere pedidos-demo.js antes. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };
  var cop = function (n) { return "$" + n.toLocaleString("es-CO"); };
  var fecha = function (iso) {
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  };
  var nombreEstado = function (id) {
    if (id === "cancelado") return "Cancelado";
    return estadosPedido.filter(function (e) { return e.id === id; })[0].texto;
  };
  var chip = function (id) { return '<span class="st st-' + id + '">' + nombreEstado(id) + '</span>'; };
  var unidades = function (p) { return p.items.reduce(function (s, i) { return s + i.cantidad; }, 0); };

  /* ---------- Historial ---------- */
  var lista = $("ordLista");
  if (lista) {
    var filtros = $("ordFiltros");
    var actual = "todos";
    var opciones = [["todos", "Todos"]].concat(estadosPedido.map(function (e) { return [e.id, e.texto]; }), [["cancelado", "Cancelados"]]);

    var pintarFiltros = function () {
      filtros.innerHTML = opciones.map(function (o) {
        return '<button type="button" data-f="' + o[0] + '" class="' + (o[0] === actual ? "is-active" : "") + '" aria-pressed="' + (o[0] === actual) + '">' + o[1] + '</button>';
      }).join("");
    };
    var pintar = function () {
      var ps = pedidosDemo.filter(function (p) { return actual === "todos" || p.estado === actual; });
      if (!ps.length) {
        lista.innerHTML = '<div class="card ord-empty"><p><strong>' +
          (actual === "todos" ? "Aún no tienes pedidos." : "No tienes pedidos con este estado.") +
          '</strong></p><a class="btn btn-primary" href="tienda-pod.html">Ir a la tienda</a></div>';
        return;
      }
      lista.innerHTML = ps.map(function (p) {
        var fotos = p.items.slice(0, 4).map(function (i) { return '<img src="' + esc(i.imagen) + '" alt="' + esc(i.nombre) + '">'; }).join("");
        var mas = p.items.length > 4 ? '<span>+' + (p.items.length - 4) + '</span>' : "";
        return '<article class="card ord-card">' +
          '<div class="ord-top"><div><div class="ord-code">#' + p.codigo + '</div><p class="ord-date">' + fecha(p.fecha) + '</p></div>' + chip(p.estado) + '</div>' +
          '<div class="ord-thumbs">' + fotos + mas + '<span>' + unidades(p) + (unidades(p) === 1 ? " producto" : " productos") + '</span></div>' +
          '<div class="ord-bottom"><div class="ord-total"><small>Total</small>' + cop(totalPedido(p)) + '</div>' +
          '<a class="btn btn-outline" href="detalle-pedido.html?id=' + p.codigo + '">Ver detalle</a></div>' +
        '</article>';
      }).join("");
    };
    filtros.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]");
      if (!b) return;
      actual = b.dataset.f; pintarFiltros(); pintar();
    });
    pintarFiltros(); pintar();
  }

  /* ---------- Detalle ---------- */
  var cont = $("detalle");
  if (cont) {
    var id = new URLSearchParams(location.search).get("id");
    var p = pedidosDemo.filter(function (x) { return x.codigo === id; })[0];
    if (!p) {
      document.title = "Pedido no encontrado | Peluditos y Punto";
      $("detTitulo").textContent = "No encontramos este pedido";
      cont.innerHTML = '<div class="card ord-empty"><p>Revisa el enlace o vuelve a tu historial.</p><a class="btn btn-primary" href="historial-pedidos.html">Ver mis pedidos</a></div>';
      return;
    }
    document.title = "Pedido " + p.codigo + " | Peluditos y Punto";
    $("detMiga").textContent = "#" + p.codigo;
    $("detTitulo").textContent = "Pedido #" + p.codigo;
    $("detSub").textContent = "Realizado el " + fecha(p.fecha);

    var linea;
    if (p.estado === "cancelado") {
      linea = '<div class="tl-cancel"><strong>Pedido cancelado.</strong> Si ya se hizo un cobro, se reembolsará por el mismo medio de pago. ¿Dudas? <a href="contacto.html">Escríbenos</a>.</div>';
    } else {
      var idx = estadosPedido.map(function (e) { return e.id; }).indexOf(p.estado);
      linea = '<ol class="timeline">' + estadosPedido.map(function (e, i) {
        return '<li class="' + (i <= idx ? "done" : "") + (i === idx ? " current" : "") + '"' + (i === idx ? ' aria-current="step"' : "") + '>' + e.texto + '</li>';
      }).join("") + '</ol><p class="tl-msg">' + estadosPedido[idx].detalle + (p.guia ? " Guía de seguimiento: <strong>" + p.guia + "</strong>." : "") + '</p>';
    }

    var filas = p.items.map(function (i) {
      return '<tr><td><div class="order-product"><img src="' + esc(i.imagen) + '" alt="">' +
        '<div><strong><a href="producto-pod.html?id=' + i.id + '">' + esc(i.nombre) + '</a></strong><small>' + esc(i.detalle) + '</small></div></div></td>' +
        '<td>' + i.cantidad + '</td><td>' + cop(i.precio * i.cantidad) + '</td></tr>';
    }).join("");
    var sub = totalPedido(p) - p.envio;

    cont.innerHTML =
      '<section class="card card-body" aria-label="Estado del pedido"><h2 class="card-title">Estado del pedido ' + chip(p.estado) + '</h2>' +
        linea + '<p class="tl-msg" style="margin-top:10px">Entrega estimada: <strong>' + p.entrega + '</strong></p></section>' +
      '<section class="card det-block" style="margin-top:20px" aria-label="Productos">' +
        '<table class="order-table"><thead><tr><th scope="col">Producto</th><th scope="col">Cantidad</th><th scope="col">Precio</th></tr></thead><tbody>' + filas + '</tbody></table>' +
        '<dl class="order-totals" style="border-top:1px solid var(--border)">' +
          '<div class="summary-row"><dt>Subtotal</dt><dd>' + cop(sub) + '</dd></div>' +
          '<div class="summary-row"><dt>Envío</dt><dd>' + cop(p.envio) + '</dd></div>' +
          '<div class="summary-row summary-total"><dt>Total</dt><dd>' + cop(totalPedido(p)) + '</dd></div></dl></section>' +
      '<div class="det-grid">' +
        '<section class="card card-body"><h2>Dirección de envío</h2><p>' + esc(p.direccion) + '</p><p>' + esc(p.ciudad) + '</p><p>Tel. ' + esc(p.telefono) + '</p></section>' +
        '<section class="card card-body"><h2>Pago</h2><p>' + esc(p.metodo) + '</p><p>Procesado por Mercado Pago</p></section>' +
      '</div>' +
      '<div class="det-actions"><a class="btn btn-outline" href="historial-pedidos.html">&larr; Mis pedidos</a>' +
        '<a class="btn btn-outline" href="contacto.html">Necesito ayuda con este pedido</a>' +
        '<button type="button" class="btn btn-primary" onclick="window.print()">Imprimir</button></div>';
  }
})();

/* Pedidos del panel admin (solo maquetación, guarda cambios en localStorage).
   Requiere pedidos-demo.js antes. */
(function () {
  var CLAVE = "pp_admin_pedidos_v1";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };
  var cop = function (n) { return "$" + n.toLocaleString("es-CO"); };
  var fecha = function (iso) {
    var p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  };

  /* Datos que solo ve el administrador: cliente y personalización */
  var cliente = { nombre: "Ada D’Agostino", correo: "ada@correo.com" };
  var extra = {
    "ORD-987654321": { cliente: cliente, pers: [
      { mascota: "Luna", texto: "Luna", nota: "Letra cursiva, color blanco", foto: "img/gato-consentido.png" },
      { mascota: "Max", texto: "Mi humano favorito", nota: "Usar la foto adjunta", foto: "img/dog-mom.jpg" } ] },
    "ORD-987601155": { cliente: cliente, pers: [ { mascota: "Michi", texto: "Amor de bigotes", nota: "Diseño prediseñado, sin foto" } ] },
    "ORD-987544820": { cliente: cliente, pers: [ { mascota: "Rocky", texto: "Dog Mom", nota: "Texto en negro" }, { mascota: "Luna", texto: "Gato Consentido", nota: "" } ] },
    "ORD-987310072": { cliente: cliente, pers: [ { mascota: "Luna", texto: "Las 4 estaciones", nota: "" } ] },
    "ORD-987002913": { cliente: cliente, pers: [ { mascota: "Max", texto: "Sol y Luna", nota: "Cancelado antes de producción" } ] },
    "ORD-987700001": { cliente: { nombre: "Carlos Rojas", correo: "carlos.rojas@correo.com" }, pers: [ { mascota: "Toby", texto: "Toby", nota: "Letra grande" } ] },
    "ORD-987700002": { cliente: { nombre: "Valentina Gómez", correo: "vale.gomez@correo.com" }, pers: [ { mascota: "Nala", texto: "", nota: "Foto de Nala en el centro", foto: "img/gato-consentido-2.jpg" } ] }
  };
  var otros = [
    { codigo: "ORD-987700001", fecha: "2026-11-12", estado: "recibido", entrega: "19 – 24 de noviembre de 2026", envio: 15000, metodo: "PSE",
      direccion: "Carrera 15 # 80 - 20", ciudad: "Medellín", telefono: "311 555 0102",
      items: [ { nombre: "Pañoleta “Mi Mejor Amigo”", imagen: "img/panoleta-mi-mejor-amigo.jpg", detalle: "Color: Azul | Talla: S", cantidad: 1, precio: 25000, id: 4 } ] },
    { codigo: "ORD-987700002", fecha: "2026-11-13", estado: "produccion", entrega: "20 – 25 de noviembre de 2026", envio: 15000, metodo: "Nequi",
      direccion: "Av. 6N # 23 - 10", ciudad: "Cali", telefono: "320 555 0188",
      items: [ { nombre: "Mug “Gato Consentido”", imagen: "img/gato-consentido.png", detalle: "Color: Blanco", cantidad: 1, precio: 24500, id: 6 } ] }
  ];
  var todos = pedidosDemo.concat(otros);

  /* Cambios guardados por el admin */
  var cambios = {};
  try { cambios = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) {}
  todos.forEach(function (p) { if (cambios[p.codigo]) { p.estado = cambios[p.codigo].estado; p.guia = cambios[p.codigo].guia || p.guia; } });

  var etiqueta = { recibido: ["Recibido", "badge-info"], produccion: ["En producción", "badge-warn"], enviado: ["Enviado", "badge-info"], entregado: ["Entregado", "badge-ok"], cancelado: ["Cancelado", "badge-danger"] };
  var chip = function (e) { return '<span class="badge ' + etiqueta[e][1] + '">' + etiqueta[e][0] + '</span>'; };
  var nom = function (p) { return extra[p.codigo].cliente.nombre; };

  /* ---------- Listado ---------- */
  var tabla = $("tabla");
  if (tabla) {
    var q = $("buscar"), est = $("estado"), conteo = $("conteo");
    var pintar = function () {
      var t = q.value.trim().toLowerCase(), e = est.value;
      var lista = todos.filter(function (p) {
        if (e && p.estado !== e) return false;
        return !t || (p.codigo + " " + nom(p)).toLowerCase().indexOf(t) !== -1;
      }).sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
      conteo.textContent = lista.length + " de " + todos.length + " pedidos";
      tabla.innerHTML = lista.length ? lista.map(function (p) {
        return '<tr><td><strong>#' + p.codigo + '</strong></td><td>' + esc(nom(p)) + '</td><td>' + fecha(p.fecha) + '</td><td>' + cop(totalPedido(p)) + '</td><td>' + chip(p.estado) + '</td>' +
          '<td><div class="row-actions"><a class="btn btn-outline btn-sm" href="admin-pedido-detalle.html?id=' + p.codigo + '">Ver detalle</a></div></td></tr>';
      }).join("") : '<tr class="empty-row"><td colspan="6">No hay pedidos con esos filtros.</td></tr>';
    };
    q.addEventListener("input", pintar); est.addEventListener("change", pintar); pintar();
  }

  /* ---------- Detalle ---------- */
  var det = $("det");
  if (det) {
    var id = new URLSearchParams(location.search).get("id");
    var p = todos.filter(function (x) { return x.codigo === id; })[0];
    if (!p) { det.hidden = true; $("det-vacio").hidden = false; $("top-h1").textContent = "Pedido no encontrado"; return; }
    var ex = extra[p.codigo];
    document.title = "Pedido " + p.codigo + " | Admin Peluditos y Punto";
    $("top-h1").textContent = "Pedido #" + p.codigo;
    $("top-sub").textContent = "Realizado el " + fecha(p.fecha) + " · " + ex.cliente.nombre;

    $("items").innerHTML = p.items.map(function (i, k) {
      var s = ex.pers[k] || {};
      var pers = (s.mascota || s.texto || s.nota || s.foto)
        ? '<dl class="person"><dt>Personalización</dt>' +
          '<dd>Mascota: <strong>' + esc(s.mascota || "—") + '</strong></dd>' +
          (s.texto ? '<dd>Texto del diseño: “' + esc(s.texto) + '”</dd>' : "") +
          (s.nota ? '<dd>Nota del cliente: ' + esc(s.nota) + '</dd>' : "") +
          (s.foto ? '<dd><img src="../' + esc(s.foto) + '" alt="Foto enviada por el cliente"></dd>' : "") + '</dl>' : "";
      return '<div class="item-line"><img src="../' + esc(i.imagen) + '" alt=""><div class="info"><strong>' + esc(i.nombre) + '</strong>' +
        '<small>' + esc(i.detalle) + ' · Cantidad: ' + i.cantidad + ' · ' + cop(i.precio * i.cantidad) + '</small>' + pers + '</div></div>';
    }).join("");

    $("cliente").innerHTML =
      '<p><strong>' + esc(ex.cliente.nombre) + '</strong> · ' + esc(ex.cliente.correo) + '</p>' +
      '<p>' + esc(p.direccion) + ', ' + esc(p.ciudad) + '</p><p>Tel. ' + esc(p.telefono) + '</p><p>Pago: ' + esc(p.metodo) + ' (Mercado Pago)</p>';

    var sub = totalPedido(p) - p.envio;
    $("resumen").innerHTML =
      '<div class="sum-row"><span>Subtotal</span><span>' + cop(sub) + '</span></div>' +
      '<div class="sum-row"><span>Envío</span><span>' + cop(p.envio) + '</span></div>' +
      '<div class="sum-row total"><span>Total</span><span>' + cop(totalPedido(p)) + '</span></div>';

    var badge = $("badge"), sel = $("nuevo-estado"), guia = $("guia"), campo = $("campo-guia");
    var estado = function () { badge.className = "badge " + etiqueta[p.estado][1]; badge.textContent = etiqueta[p.estado][0]; };
    var verGuia = function () { campo.hidden = sel.value !== "enviado" && sel.value !== "entregado"; };
    sel.value = p.estado; guia.value = p.guia || ""; estado(); verGuia();
    sel.addEventListener("change", verGuia);
    $("guardar").addEventListener("click", function () {
      if ((sel.value === "enviado") && !guia.value.trim()) { guia.focus(); guia.style.borderColor = "#B91C1C"; return; }
      guia.style.borderColor = "";
      p.estado = sel.value; p.guia = guia.value.trim() || p.guia;
      cambios[p.codigo] = { estado: p.estado, guia: p.guia };
      try { localStorage.setItem(CLAVE, JSON.stringify(cambios)); } catch (e) {}
      estado(); $("ok").hidden = false;
      setTimeout(function () { $("ok").hidden = true; }, 3000);
    });
  }
})();

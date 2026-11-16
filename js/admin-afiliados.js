/* Enlaces de afiliados del panel admin (solo maquetación; guarda en localStorage).
   Requiere afiliados.js antes. Los clics son números de ejemplo. */
(function () {
  var CLAVE = "pp_admin_afiliados_v1";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };
  var cop = function (n) { return "$" + Number(n).toLocaleString("es-CO"); };
  var tabla = $("tabla"); if (!tabla) return;

  var leer = function () {
    try { var c = localStorage.getItem(CLAVE); if (c) return JSON.parse(c); } catch (e) {}
    return productosAfiliados.map(function (p, k) {
      return { id: p.id, nombre: p.nombre, tienda: p.tienda, categoria: p.categoria, precio: p.precio, imagen: p.imagen, url: p.url,
               estado: "activo", clics: [128, 94, 61, 43, 27, 15][k % 6] };
    });
  };
  var lista = leer();
  var guardar = function () { try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) {} };

  var q = $("buscar"), ft = $("f-tienda"), dlg = $("dlg"), form = $("form-afi"), editando = null;

  var tiendas = function () {
    var t = []; lista.forEach(function (p) { if (t.indexOf(p.tienda) === -1) t.push(p.tienda); }); return t.sort();
  };
  var pintarTiendas = function () {
    var v = ft.value;
    ft.innerHTML = '<option value="">Todas las tiendas</option>' + tiendas().map(function (t) { return '<option>' + esc(t) + '</option>'; }).join("");
    ft.value = v;
    $("lista-tiendas").innerHTML = tiendas().map(function (t) { return '<option value="' + esc(t) + '">'; }).join("");
  };
  var kpis = function () {
    var act = lista.filter(function (p) { return p.estado === "activo"; }).length;
    var total = lista.reduce(function (s, p) { return s + p.clics; }, 0);
    var top = lista.slice().sort(function (a, b) { return b.clics - a.clics; })[0];
    $("k-act").textContent = act; $("k-clics").textContent = total.toLocaleString("es-CO");
    $("k-top").textContent = top ? top.nombre : "—";
  };
  var pintar = function () {
    var t = q.value.trim().toLowerCase(), s = ft.value;
    var ps = lista.filter(function (p) { return (!s || p.tienda === s) && (!t || (p.nombre + " " + p.tienda).toLowerCase().indexOf(t) !== -1); });
    tabla.innerHTML = ps.length ? ps.map(function (p) {
      return '<tr><td><div class="prod-cell">' + (p.imagen ? '<img src="../' + esc(p.imagen) + '" alt="">' : '') + '<span><strong>' + esc(p.nombre) + '</strong><small><a href="' + esc(p.url) + '" target="_blank" rel="noopener">Ver enlace</a></small></span></div></td>' +
        '<td>' + esc(p.tienda) + '</td><td>' + esc(p.categoria) + '</td><td>' + cop(p.precio) + '</td><td class="num-click">' + p.clics + '</td>' +
        '<td><span class="badge ' + (p.estado === "activo" ? "badge-ok" : "badge-muted") + '">' + (p.estado === "activo" ? "Activo" : "Inactivo") + '</span></td>' +
        '<td><div class="row-actions"><button type="button" class="btn btn-outline btn-sm" data-a="edit" data-id="' + p.id + '">Editar</button>' +
        '<button type="button" class="btn btn-outline btn-sm" data-a="tog" data-id="' + p.id + '">' + (p.estado === "activo" ? "Desactivar" : "Activar") + '</button>' +
        '<button type="button" class="btn btn-danger btn-sm" data-a="del" data-id="' + p.id + '">Eliminar</button></div></td></tr>';
    }).join("") : '<tr class="empty-row"><td colspan="7">No hay enlaces con esos filtros.</td></tr>';
    kpis();
  };
  var refrescar = function () { pintarTiendas(); pintar(); };

  var abrir = function (p) {
    editando = p || null;
    $("dlg-t").textContent = p ? "Editar enlace" : "Nuevo enlace";
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    $("a-nombre").value = p ? p.nombre : ""; $("a-tienda").value = p ? p.tienda : ""; $("a-cat").value = p ? p.categoria : "";
    $("a-precio").value = p ? p.precio : ""; $("a-estado").value = p ? p.estado : "activo"; $("a-url").value = p ? p.url : ""; $("a-img").value = p && p.imagen ? p.imagen : "";
    dlg.showModal(); $("a-nombre").focus();
  };
  $("nuevo").addEventListener("click", function () { abrir(null); });
  $("cancelar").addEventListener("click", function () { dlg.close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll(".field").forEach(function (f) {
      var i = f.querySelector("[required]"); if (!i) return;
      var bien = i.value.trim() !== "" && i.checkValidity() && (i.type !== "url" || /^https?:\/\//.test(i.value));
      f.classList.toggle("invalid", !bien); if (!bien) ok = false;
    });
    if (!ok) return;
    var d = { nombre: $("a-nombre").value.trim(), tienda: $("a-tienda").value.trim(), categoria: $("a-cat").value, precio: Number($("a-precio").value),
              estado: $("a-estado").value, url: $("a-url").value.trim(), imagen: $("a-img").value.trim() };
    if (editando) Object.assign(editando, d);
    else lista.push(Object.assign({ id: Date.now(), clics: 0 }, d));
    guardar(); dlg.close(); refrescar();
  });

  tabla.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-a]"); if (!b) return;
    var p = lista.filter(function (x) { return String(x.id) === b.dataset.id; })[0]; if (!p) return;
    if (b.dataset.a === "edit") abrir(p);
    else if (b.dataset.a === "tog") { p.estado = p.estado === "activo" ? "inactivo" : "activo"; guardar(); pintar(); }
    else if (b.dataset.a === "del" && confirm("¿Eliminar el enlace “" + p.nombre + "”?")) { lista = lista.filter(function (x) { return x !== p; }); guardar(); refrescar(); }
  });
  q.addEventListener("input", pintar); ft.addEventListener("change", pintar);
  refrescar();
})();

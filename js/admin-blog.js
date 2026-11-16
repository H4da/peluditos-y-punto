/* =========================================================
   Gestión del blog (funcional con localStorage)
   Requiere: articulos.js, admin-store.js
   ========================================================= */
(function () {
  const POR_PAGINA = 5;
  const $ = function (id) { return document.getElementById(id); };
  const esc = function (t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  const fechaLarga = function (iso) {
    if (!iso) return "—";
    const p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  };
  const clase = { "Publicado": "ok", "Borrador": "muted", "Programado": "info" };

  const ESTADO_TAB = { Publicados: "Publicado", Borradores: "Borrador", Programados: "Programado" };
  let tab = "Todos", pagina = 1;

  const lista = function () {
    return BlogStore.todos().map(function (p) {
      return Object.assign({}, p, { estado: BlogStore.estadoReal(p) });
    }).sort(function (a, b) { return (b.fecha || "9999") < (a.fecha || "9999") ? -1 : 1; });
  };

  function llenarCategorias() {
    const sel = $("filtroCat");
    const cats = categoriasBlog.slice();
    BlogStore.todos().forEach(function (p) { if (p.categoria && cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    sel.innerHTML = '<option value="">Todas las categorías</option>' +
      cats.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join("");
  }

  function dibujar() {
    const todos = lista();
    const cuenta = function (e) { return todos.filter(function (p) { return p.estado === e; }).length; };
    $("tabTodos").textContent = "Todos (" + todos.length + ")";
    $("tabPublicado").textContent = "Publicados (" + cuenta("Publicado") + ")";
    $("tabBorrador").textContent = "Borradores (" + cuenta("Borrador") + ")";
    $("tabProgramado").textContent = "Programados (" + cuenta("Programado") + ")";
    document.querySelectorAll(".tabs a").forEach(function (a) {
      const activo = a.dataset.tab === tab;
      a.classList.toggle("is-active", activo);
      a.setAttribute("aria-selected", activo ? "true" : "false");
    });

    const q = $("buscar").value.trim().toLowerCase();
    const cat = $("filtroCat").value;
    const filtrados = todos.filter(function (p) {
      return (tab === "Todos" || p.estado === ESTADO_TAB[tab]) &&
             (!cat || p.categoria === cat) &&
             (!q || p.titulo.toLowerCase().indexOf(q) >= 0);
    });

    const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
    if (pagina > paginas) pagina = paginas;
    const ini = (pagina - 1) * POR_PAGINA;
    const visibles = filtrados.slice(ini, ini + POR_PAGINA);

    $("postsBody").innerHTML = visibles.map(function (p) {
      return '<tr>' +
        '<td style="max-width:420px"><strong>' + esc(p.titulo) + '</strong></td>' +
        '<td>' + esc(p.categoria || "—") + '</td>' +
        '<td style="white-space:nowrap">' + fechaLarga(p.fecha) + '</td>' +
        '<td><span class="badge badge-' + (clase[p.estado] || "muted") + '">' + p.estado + '</span></td>' +
        '<td><div class="row-actions">' +
          '<a href="admin-editor.html?id=' + p.id + '" class="btn btn-outline btn-sm">Editar</a>' +
          '<button type="button" class="btn btn-danger btn-sm" data-eliminar="' + p.id + '">Eliminar</button>' +
        '</div></td></tr>';
    }).join("");

    $("vacio").hidden = filtrados.length > 0;
    $("tablaWrap").hidden = filtrados.length === 0;

    $("pagInfo").textContent = filtrados.length
      ? "Mostrando " + (ini + 1) + "–" + (ini + visibles.length) + " de " + filtrados.length + " artículos"
      : "0 artículos";
    let nums = "";
    for (let i = 1; i <= paginas; i++) {
      nums += '<a href="#" data-pag="' + i + '"' + (i === pagina ? ' class="is-active"' : '') + '>' + i + '</a>';
    }
    $("pagNums").innerHTML = paginas > 1 ? nums : "";
  }

  //  Eventos 
  document.querySelector(".tabs").addEventListener("click", function (e) {
    const a = e.target.closest("a[data-tab]");
    if (!a) return;
    e.preventDefault(); tab = a.dataset.tab; pagina = 1; dibujar();
  });
  $("buscar").addEventListener("input", function () { pagina = 1; dibujar(); });
  $("filtroCat").addEventListener("change", function () { pagina = 1; dibujar(); });
  $("pagNums").addEventListener("click", function (e) {
    const a = e.target.closest("a[data-pag]");
    if (!a) return;
    e.preventDefault(); pagina = Number(a.dataset.pag); dibujar();
  });
  $("postsBody").addEventListener("click", function (e) {
    const b = e.target.closest("[data-eliminar]");
    if (!b) return;
    const p = BlogStore.obtener(b.dataset.eliminar);
    if (p && confirm("¿Eliminar el artículo “" + p.titulo + "”? Esta acción no se puede deshacer.")) {
      BlogStore.eliminar(p.id);
      aviso("Artículo eliminado");
      llenarCategorias(); dibujar();
    }
  });
  $("restablecer").addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("¿Restablecer los artículos de ejemplo? Se perderán los cambios hechos en este navegador.")) {
      BlogStore.restablecer(); llenarCategorias(); dibujar(); aviso("Datos restablecidos");
    }
  });

  //  Aviso  
  function aviso(texto) {
    const t = $("toast");
    t.textContent = texto; t.hidden = false;
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { t.hidden = true; }, 3200);
  }
  try {
    const msg = sessionStorage.getItem("pp_aviso");
    if (msg) { sessionStorage.removeItem("pp_aviso"); aviso(msg); }
  } catch (e) {}

  llenarCategorias();
  dibujar();
})();

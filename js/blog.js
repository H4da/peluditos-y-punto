/* =========================================================
   Blog: listado, vista por categoría, búsqueda y detalle
   Requiere articulos.js cargado antes que este archivo.

   Direcciones que entiende blog.html:
     blog.html                       -> todos los artículos
     blog.html?categoria=Nutrición   -> artículos de una categoría
     blog.html?q=correa              -> resultados de búsqueda
     blog.html?pagina=2              -> paginación (se combina con lo anterior)
   ========================================================= */
(function () {
  const POR_PAGINA = 5;
  const params = new URLSearchParams(window.location.search);
  const porId = function (id) { return document.getElementById(id); };

  const esc = function (t) {
    return String(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  // minúsculas y sin tildes, para que "nutricion" encuentre "Nutrición"
  const norm = function (t) {
    return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  const fecha = function (iso) {
    const p = iso.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2])
      .toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  };

  const imagen = function (a) {
    return a.imagen ? '<img src="' + esc(a.imagen) + '" alt="' + esc(a.titulo) + '">' : "";
  };

  // Una frase para la cabecera de cada categoría
  const descripciones = {
    "Adiestramiento": "Comandos, hábitos y entrenamiento positivo para convivir mejor con tu mascota.",
    "Salud y bienestar": "Cuidados, señales de alerta y consejos para mantener a tu mascota sana y tranquila.",
    "Nutrición": "Guías de alimentación y análisis de marcas para que coma mejor cada día.",
    "Reseña de productos": "Opiniones y comparativas de productos para ayudarte a elegir bien."
  };

  // Más recientes primero
  const ordenados = articulos.slice().sort(function (a, b) {
    return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : a.id - b.id;
  });

  const enlace = function (a) { return "articulo.html?id=" + a.id; };
  const enlaceCategoria = function (c) { return "blog.html?categoria=" + encodeURIComponent(c); };
  const insignia = function (a) {
    return '<a class="badge" href="' + enlaceCategoria(a.categoria) + '">' + esc(a.categoria) + '</a>';
  };

  /* Filtros que llegan en la dirección */
  const filtroCategoria = params.get("categoria");
  const consulta = (params.get("q") || "").trim();

  /* Barra lateral para las dos pantallas */
  const listaCategorias = porId("blog-categorias");
  if (listaCategorias) {
    const item = function (texto, href, total, activa) {
      return '<li' + (activa ? ' class="is-active"' : '') + '>' +
        '<a href="' + href + '"' + (activa ? ' aria-current="page"' : '') + '>' + esc(texto) + '</a>' +
        '<span class="count">' + total + '</span></li>';
    };
    listaCategorias.innerHTML =
      item("Todas las categorías", "blog.html", articulos.length, !filtroCategoria && !!porId("blog-destacado")) +
      categoriasBlog.map(function (c) {
        const total = articulos.filter(function (a) { return a.categoria === c; }).length;
        return item(c, enlaceCategoria(c), total, filtroCategoria === c);
      }).join("");
  }

  const listaTop = porId("blog-top");
  if (listaTop) {
    listaTop.innerHTML = ordenados.filter(function (a) { return a.top; }).map(function (a) {
      return (
        '<li>' +
          '<a href="' + enlace(a) + '" class="top-thumb">' + imagen(a) + '</a>' +
          '<div><a href="' + enlace(a) + '" class="top-title">' + esc(a.titulo) + '</a>' +
          '<span class="top-date">' + fecha(a.fecha) + '</span></div>' +
        '</li>'
      );
    }).join("");
  }

  /*  Boletín (visual por ahora) */
  const formBoletin = porId("form-boletin");
  if (formBoletin) {
    formBoletin.addEventListener("submit", function (e) {
      e.preventDefault();
      porId("boletin-mensaje").textContent = "¡Gracias por suscribirte!";
      formBoletin.reset();
    });
  }

  /* LISTADO */
  const zonaDestacado = porId("blog-destacado");
  if (zonaDestacado) {
    const formBusqueda = porId("form-busqueda");
    if (formBusqueda && consulta) formBusqueda.elements.q.value = consulta;

    // 1) Qué artículos se muestran
    let base = ordenados;
    if (filtroCategoria) base = base.filter(function (a) { return a.categoria === filtroCategoria; });
    if (consulta) {
      const n = norm(consulta);
      base = base.filter(function (a) { return norm(a.titulo + " " + a.extracto).indexOf(n) !== -1; });
    }
    const hayFiltro = !!(filtroCategoria || consulta);

    // 2) Cabecera según la vista
    const titulo = porId("blog-titulo");
    const subtitulo = porId("blog-subtitulo");
    const migas = porId("blog-migas");
    const volver = ' <a href="blog.html" class="read-more">Ver todos los artículos</a>';
    document.title = (filtroCategoria ? filtroCategoria + " | Blog" : consulta ? "Búsqueda | Blog" : "Blog") + " | Peluditos y Punto";

    if (filtroCategoria) {
      const existe = categoriasBlog.indexOf(filtroCategoria) !== -1;
      titulo.textContent = filtroCategoria;
      subtitulo.innerHTML = existe
        ? esc(descripciones[filtroCategoria] || "") + " (" + base.length + (base.length === 1 ? " artículo" : " artículos") + ")." + volver
        : "Esa categoría no existe." + volver;
      migas.innerHTML = '<a href="blog.html">Blog</a> / <span>' + esc(filtroCategoria) + '</span>';
    } else if (consulta) {
      titulo.textContent = "Resultados de búsqueda";
      subtitulo.innerHTML = base.length + (base.length === 1 ? " resultado" : " resultados") + " para “" + esc(consulta) + "”." + volver;
      migas.innerHTML = '<a href="blog.html">Blog</a> / <span>Búsqueda</span>';
    }

    // 3) Página actual
    const totalPaginas = Math.max(1, Math.ceil(base.length / POR_PAGINA));
    let pagina = parseInt(params.get("pagina"), 10) || 1;
    if (pagina < 1 || pagina > totalPaginas) pagina = 1;
    const lista = base.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    // Dirección que conserva la categoría o la búsqueda al cambiar de página
    const dirPagina = function (n) {
      const p = new URLSearchParams();
      if (filtroCategoria) p.set("categoria", filtroCategoria);
      if (consulta) p.set("q", consulta);
      if (n > 1) p.set("pagina", n);
      const s = p.toString();
      return "blog.html" + (s ? "?" + s : "");
    };

    // 4) Destacado: solo en el listado general, página 1
    if (!hayFiltro && pagina === 1 && lista.length) {
      const d = lista.shift();
      zonaDestacado.innerHTML =
        '<article class="card featured">' +
          '<a href="' + enlace(d) + '" class="post-image">' + imagen(d) + '</a>' +
          '<div class="post-body">' +
            '<div class="meta">' + insignia(d) + '<time>' + fecha(d.fecha) + '</time></div>' +
            '<h2 class="post-title"><a href="' + enlace(d) + '">' + esc(d.titulo) + '</a></h2>' +
            '<p class="excerpt">' + esc(d.extracto) + '</p>' +
            '<a href="' + enlace(d) + '" class="read-more">Leer más &rarr;</a>' +
          '</div>' +
        '</article>';
    }

    // 5) Tarjetas (o mensaje de "sin resultados")
    if (base.length === 0) {
      porId("blog-grid").innerHTML =
        '<div class="empty-state">' +
          '<p><strong>' + (consulta ? "No encontramos artículos con esa búsqueda." : "Todavía no hay artículos en esta categoría.") + '</strong></p>' +
          '<p>Revisa otra categoría o vuelve al listado completo.</p>' +
          '<a href="blog.html" class="btn btn-outline">Ver todos los artículos</a>' +
        '</div>';
    } else {
      porId("blog-grid").innerHTML = lista.map(function (a) {
        return (
          '<article class="card post-card">' +
            '<a href="' + enlace(a) + '" class="post-image">' + imagen(a) + '</a>' +
            '<div class="post-body">' +
              '<div class="meta">' + insignia(a) + '<time>' + fecha(a.fecha) + '</time></div>' +
              '<h3 class="post-title"><a href="' + enlace(a) + '">' + esc(a.titulo) + '</a></h3>' +
              '<p class="excerpt">' + esc(a.extracto) + '</p>' +
              '<a href="' + enlace(a) + '" class="read-more">Leer más &rarr;</a>' +
            '</div>' +
          '</article>'
        );
      }).join("");
    }

    // 6) Paginador
    let html = pagina > 1
      ? '<a href="' + dirPagina(pagina - 1) + '" aria-label="Página anterior">&lsaquo;</a>'
      : '<span class="disabled" aria-hidden="true">&lsaquo;</span>';
    for (let i = 1; i <= totalPaginas; i++) {
      html += i === pagina
        ? '<span class="current" aria-current="page">' + i + '</span>'
        : '<a href="' + dirPagina(i) + '">' + i + '</a>';
    }
    html += pagina < totalPaginas
      ? '<a href="' + dirPagina(pagina + 1) + '" aria-label="Página siguiente">&rsaquo;</a>'
      : '<span class="disabled" aria-hidden="true">&rsaquo;</span>';
    porId("blog-paginacion").innerHTML = html;
    if (totalPaginas < 2) porId("blog-paginacion").style.display = "none";
  }

  /*  DETALLE  */
  const zonaArticulo = porId("articulo");
  if (zonaArticulo) {
    const idPedido = params.get("id");
    const a = idPedido
      ? articulos.find(function (x) { return String(x.id) === idPedido; })
      : ordenados[0];

    if (!a) {
      zonaArticulo.innerHTML =
        '<div class="article-body"><p>No encontramos este artículo. ' +
        '<a href="blog.html" class="read-more">Volver al blog</a></p></div>';
      return;
    }

    document.title = a.titulo + " | Peluditos y Punto";
    porId("bc-categoria").innerHTML = '<a href="' + enlaceCategoria(a.categoria) + '">' + esc(a.categoria) + '</a>';
    porId("articulo-portada").innerHTML = imagen(a);
    porId("articulo-categoria").innerHTML = '<a href="' + enlaceCategoria(a.categoria) + '">' + esc(a.categoria) + '</a>';
    porId("articulo-fecha").textContent = fecha(a.fecha);
    porId("articulo-titulo").textContent = a.titulo;
    porId("articulo-contenido").innerHTML = a.contenido;

    // Productos de marcas aliadas
    const zonaAfiliados = porId("blog-afiliados");
    if (zonaAfiliados && a.afiliados) {
      zonaAfiliados.innerHTML = a.afiliados.map(function (p) {
        return (
          '<section class="widget">' +
            '<h2>' + esc(p.marca) + '</h2>' +
            '<a href="' + esc(p.url) + '" class="aff-item" target="_blank" rel="noopener sponsored">' +
              '<span class="top-thumb">' + (p.imagen ? '<img src="' + esc(p.imagen) + '" alt="' + esc(p.producto) + '">' : '') + '</span>' +
              '<span><span class="top-title">' + esc(p.producto) + '</span>' +
              '<span class="top-date">' + esc(p.peso) + '</span></span>' +
            '</a>' +
          '</section>'
        );
      }).join("");
    }
  }
})();

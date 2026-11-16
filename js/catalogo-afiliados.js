/* =========================================================
   Productos recomendados: dibuja las tarjetas desde afiliados.js
   y aplica filtros (categoría, afiliado, precio) y orden.
   Requiere afiliados.js cargado antes que este archivo.
   ========================================================= */
(function () {
  const grid = document.getElementById("afiliados-grid");
  if (!grid) return;

  const form = document.getElementById("form-filtros");
  const selectOrden = document.getElementById("ordenar");
  const info = document.getElementById("resultados");
  const params = new URLSearchParams(window.location.search);

  const esc = function (t) {
    return String(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  const precio = function (valor) { return "$ " + valor.toLocaleString("es-CO"); };

  const marcados = function (nombre) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + nombre + '"]:checked'),
      function (i) { return i.value; }
    );
  };
  const numero = function (nombre) {
    const v = form.elements[nombre].value;
    return v === "" ? null : Number(v);
  };

  const filtrar = function () {
    const categorias = marcados("categoria");
    const afiliados = marcados("afiliado");
    let min = numero("precio_min");
    let max = numero("precio_max");
    if (min !== null && max !== null && min > max) { const t = min; min = max; max = t; }

    const lista = productosAfiliados.filter(function (p) {
      if (categorias.length && categorias.indexOf(p.categoria) === -1) return false;
      if (afiliados.length && afiliados.indexOf(p.tienda) === -1) return false;
      if (min !== null && p.precio < min) return false;
      if (max !== null && p.precio > max) return false;
      return true;
    });

    const orden = selectOrden ? selectOrden.value : "recomendado";
    if (orden === "precio-asc") lista.sort(function (a, b) { return a.precio - b.precio; });
    else if (orden === "precio-desc") lista.sort(function (a, b) { return b.precio - a.precio; });
    return lista;
  };

  const tarjeta = function (p) {
    const foto = p.imagen ? '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy">' : "";
    const enlace = 'href="' + esc(p.url) + '" target="_blank" rel="noopener sponsored"';
    return (
      '<article class="product-card">' +
        '<a ' + enlace + ' class="product-image" aria-label="' + esc(p.nombre) + ' (se abre en una pestaña nueva)">' + foto + '</a>' +
        '<h3 class="product-name">' + esc(p.nombre) + '</h3>' +
        '<p class="store">Vendido por ' + esc(p.tienda) + '</p>' +
        '<p class="product-price">' + precio(p.precio) + '</p>' +
        '<a ' + enlace + ' class="btn btn-primary btn-external">Ver en tienda ' +
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>' +
          '</svg>' +
        '</a>' +
      '</article>'
    );
  };

  const dibujar = function () {
    const lista = filtrar();
    if (lista.length === 0) {
      grid.innerHTML =
        '<div class="empty-state">' +
          '<p><strong>No encontramos productos con esos filtros.</strong></p>' +
          '<p>Prueba quitando algún filtro o ampliando el rango de precio.</p>' +
          '<button type="button" class="btn btn-outline" id="limpiar-vacio">Limpiar filtros</button>' +
        '</div>';
      document.getElementById("limpiar-vacio").addEventListener("click", function () {
        form.reset();
        dibujar();
      });
    } else {
      grid.innerHTML = lista.map(tarjeta).join("");
    }
    if (info) {
      info.textContent = "Mostrando " + lista.length + " de " + productosAfiliados.length + " productos";
    }
  };

  /* Filtros que llegan desde otro enlace (?categoria=Nutrición) */
  params.getAll("categoria").forEach(function (v) {
    const c = form.querySelector('input[name="categoria"][value="' + v + '"]');
    if (c) c.checked = true;
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); dibujar(); });
  form.addEventListener("change", dibujar);
  form.addEventListener("reset", function () { setTimeout(dibujar, 0); });
  if (selectOrden) selectOrden.addEventListener("change", dibujar);

  dibujar();
})();

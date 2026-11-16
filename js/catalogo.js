/* =========================================================
   Catálogo POD: dibuja las tarjetas desde productos.js y
   aplica filtros (categoría, diseño, precio) y orden.
   Requiere productos.js cargado antes que este archivo.
   ========================================================= */
(function () {
  const grid = document.getElementById("catalogo-grid");
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

  /* ---------- Leer lo que el usuario eligió ---------- */
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

  /* ---------- Filtrar y ordenar ---------- */
  const filtrar = function () {
    const categorias = marcados("categoria");
    const disenos = marcados("diseno");
    let min = numero("precio_min");
    let max = numero("precio_max");
    if (min !== null && max !== null && min > max) { const t = min; min = max; max = t; }

    const lista = productos.filter(function (p) {
      if (categorias.length && categorias.indexOf(p.tipo) === -1) return false;
      if (disenos.length && !p.diseno.some(function (d) { return disenos.indexOf(d) !== -1; })) return false;
      if (min !== null && p.precio < min) return false;
      if (max !== null && p.precio > max) return false;
      return true;
    });

    const orden = selectOrden ? selectOrden.value : "recomendado";
    if (orden === "precio-asc") lista.sort(function (a, b) { return a.precio - b.precio; });
    else if (orden === "precio-desc") lista.sort(function (a, b) { return b.precio - a.precio; });
    else if (orden === "recientes") lista.sort(function (a, b) { return a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0; });
    return lista;
  };

  /* ---------- Dibujar ---------- */
  const tarjeta = function (p) {
    const enlace = "producto-pod.html?id=" + p.id;
    return (
      '<article class="product-card">' +
        '<a href="' + enlace + '" class="product-image">' +
          '<img src="' + esc(p.imagenes[0]) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
        '</a>' +
        '<h3 class="product-name"><a href="' + enlace + '">' + esc(p.nombre) + '</a></h3>' +
        '<p class="product-price">' + precio(p.precio) + '</p>' +
        '<button type="button" class="btn btn-primary" data-agregar="' + p.id + '">Añadir al carrito</button>' +
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
      info.textContent = "Mostrando " + lista.length + " de " + productos.length + " productos";
    }
  };

  /* ---------- Añadir al carrito desde el catálogo ---------- */
  grid.addEventListener("click", function (e) {
    const b = e.target.closest("[data-agregar]");
    if (!b) return;
    if (!PPCarrito.sesionActiva()) { PPCarrito.pedirLogin(); return; }
    const p = productos.find(function (x) { return String(x.id) === b.dataset.agregar; });
    // Desde el catálogo se añade con las primeras opciones; el cliente puede personalizar en el detalle
    PPCarrito.agregar({ id: p.id, color: p.colores[0] || "", talla: p.tallas[0] || "" });
    PPCarrito.aviso("“" + p.nombre + "” se añadió al carrito.", "Ver carrito", "carrito.html");
  });

  /* ---------- Filtros que llegan desde otro enlace (?categoria=mugs) ---------- */
  params.getAll("categoria").forEach(function (v) {
    const c = form.querySelector('input[name="categoria"][value="' + v + '"]');
    if (c) c.checked = true;
  });

  /* ---------- Eventos ---------- */
  form.addEventListener("submit", function (e) { e.preventDefault(); dibujar(); });
  form.addEventListener("change", dibujar);                       // se actualiza al marcar o escribir
  form.addEventListener("reset", function () { setTimeout(dibujar, 0); });
  if (selectOrden) selectOrden.addEventListener("change", dibujar);

  dibujar();
})();

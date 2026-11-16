/* Paginador de las tablas del panel (solo maquetación).
   Uso:  <div class="pager" data-por-pagina="5" data-etiqueta="transacciones"></div>
   Divide las filas de la tabla de su misma tarjeta en páginas. */
(function () {
  document.querySelectorAll(".pager[data-por-pagina]").forEach(function (pager) {
    var tarjeta = pager.closest(".card");
    var filas = Array.prototype.slice.call(tarjeta.querySelectorAll("table.data tbody tr"));
    var por = Number(pager.dataset.porPagina), total = filas.length;
    var paginas = Math.max(1, Math.ceil(total / por));
    var actual = 1;
    var etiqueta = pager.dataset.etiqueta || "registros";

    pager.innerHTML = '<span class="pager-info" role="status" aria-live="polite"></span><div class="pager-nums"></div>';
    var info = pager.querySelector(".pager-info"), nums = pager.querySelector(".pager-nums");

    var pintar = function () {
      var desde = (actual - 1) * por, hasta = Math.min(total, desde + por);
      filas.forEach(function (f, i) { f.hidden = i < desde || i >= hasta; });
      info.textContent = "Mostrando " + (desde + 1) + "–" + hasta + " de " + total + " " + etiqueta;
      var h = '<button type="button" data-p="' + (actual - 1) + '" aria-label="Página anterior"' + (actual === 1 ? " disabled" : "") + '>&lsaquo;</button>';
      for (var p = 1; p <= paginas; p++) {
        h += '<button type="button" data-p="' + p + '"' + (p === actual ? ' class="is-active" aria-current="page"' : "") + ">" + p + "</button>";
      }
      h += '<button type="button" data-p="' + (actual + 1) + '" aria-label="Página siguiente"' + (actual === paginas ? " disabled" : "") + '>&rsaquo;</button>';
      nums.innerHTML = h;
    };
    nums.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-p]");
      if (!b || b.disabled) return;
      actual = Number(b.dataset.p); pintar();
    });
    pintar();
  });
})();

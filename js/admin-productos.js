/* Admin > productos: "Dar de baja" / "Reactivar" (solo maquetación, no guarda). */
(function () {
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-baja]");
    if (!b) return;
    var fila = b.closest("tr");
    var badge = fila.querySelector(".badge-ok, .badge-muted:not(.is-baja)") || fila.querySelector(".badge");
    var nombre = fila.querySelector("strong").textContent;
    var activo = b.dataset.baja !== "inactivo";
    if (activo && !confirm("¿Dar de baja “" + nombre + "”? Dejará de verse en la tienda.")) return;
    badge.className = "badge " + (activo ? "badge-muted" : "badge-ok");
    badge.textContent = activo ? "Inactivo" : "Activo";
    b.textContent = activo ? "Reactivar" : "Dar de baja";
    b.dataset.baja = activo ? "inactivo" : "";
  });
})();

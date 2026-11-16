/* =========================================================
   CARRITO COMPARTIDO (solo maquetación)
   Guarda el carrito en localStorage para que el catálogo, el
   detalle del producto, el carrito y el pago vean lo mismo.
   En el sistema real esto vive en PHP/MySQL (sesión + tabla).
   Incluye también el aviso "inicia sesión" y el mensaje corto
   de "añadido al carrito".
   ========================================================= */
(function () {
  var CLAVE = "pp_carrito_v1";

  var leer = function () {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; }
  };
  var guardar = function (lista) {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("pp:carrito"));
  };
  var sesionActiva = function () {
    try { return !!sessionStorage.getItem("rol"); } catch (e) { return false; }
  };
  var unidades = function () {
    return leer().reduce(function (s, i) { return s + i.cantidad; }, 0);
  };
  var mismo = function (a, b) {
    return a.id === b.id && a.color === b.color && a.talla === b.talla &&
           (a.texto || "") === (b.texto || "") && (a.imagen || "") === (b.imagen || "");
  };
  var agregar = function (item) {
    var lista = leer();
    var existe = lista.filter(function (x) { return mismo(x, item); })[0];
    if (existe) existe.cantidad = Math.min(99, existe.cantidad + (item.cantidad || 1));
    else lista.push({ id: item.id, cantidad: item.cantidad || 1, color: item.color || "", talla: item.talla || "", texto: item.texto || "", imagen: item.imagen || "" });
    guardar(lista);
  };
  var vaciar = function () { guardar([]); };

  /* ---------- Estilos del aviso y la ventana ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".pp-toast{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;gap:14px;max-width:360px;padding:14px 16px;color:#fff;background:#0D3B66;border-left:4px solid #FDA12E;border-radius:10px;box-shadow:0 10px 30px rgba(15,23,42,.3);font:500 14px/1.4 Inter,system-ui,sans-serif}" +
    ".pp-toast a{flex:none;color:#FDA12E;font-weight:700;text-decoration:underline}" +
    ".pp-modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:16px;background:rgba(15,23,42,.6);font-family:Inter,system-ui,sans-serif}" +
    ".pp-modal-box{width:min(440px,100%);padding:28px 26px 22px;text-align:center;background:#fff;border-radius:14px;box-shadow:0 20px 50px rgba(15,23,42,.35)}" +
    ".pp-modal-ic{display:grid;place-items:center;width:60px;height:60px;margin:0 auto 14px;color:#0D3B66;background:#FFF3DC;border-radius:50%}" +
    ".pp-modal-box h2{margin:0 0 8px;font-size:20px;color:#0D3B66}" +
    ".pp-modal-box p{margin:0 0 20px;color:#475569;line-height:1.5;font-size:15px}" +
    ".pp-modal-acc{display:flex;flex-direction:column;gap:10px}" +
    ".pp-modal-acc a,.pp-modal-acc button{padding:12px 16px;font:600 15px Inter,system-ui,sans-serif;text-decoration:none;text-align:center;cursor:pointer;border-radius:8px;border:2px solid #FDA12E}" +
    ".pp-modal-acc .pri{color:#0D3B66;background:#FDA12E}.pp-modal-acc .pri:hover{background:#E07A00;border-color:#E07A00}" +
    ".pp-modal-acc .sec{color:#0D3B66;background:#fff;border-color:#0D3B66}.pp-modal-acc .sec:hover{background:#0D3B66;color:#fff}" +
    ".pp-modal-acc .ter{color:#64748B;background:transparent;border-color:transparent}.pp-modal-acc .ter:hover{text-decoration:underline}";
  document.head.appendChild(css);

  var aviso = function (texto, enlaceTexto, enlaceHref) {
    var viejo = document.querySelector(".pp-toast"); if (viejo) viejo.remove();
    var t = document.createElement("div");
    t.className = "pp-toast"; t.setAttribute("role", "status");
    var s = document.createElement("span"); s.textContent = texto; t.appendChild(s);
    if (enlaceHref) { var a = document.createElement("a"); a.href = enlaceHref; a.textContent = enlaceTexto; t.appendChild(a); }
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  };

  var pedirLogin = function () {
    var m = document.createElement("div");
    m.className = "pp-modal";
    m.innerHTML =
      '<div class="pp-modal-box" role="dialog" aria-modal="true" aria-labelledby="pp-m-t">' +
        '<div class="pp-modal-ic"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6"/></svg></div>' +
        '<h2 id="pp-m-t">Inicia sesión para continuar</h2>' +
        '<p>Para añadir productos al carrito y guardar tus pedidos necesitas una cuenta. Es rápido y gratis.</p>' +
        '<div class="pp-modal-acc"><a class="pri" href="login.html">Iniciar sesión</a><a class="sec" href="register.html">Crear cuenta</a><button type="button" class="ter">Seguir viendo productos</button></div>' +
      '</div>';
    var cerrar = function () { m.remove(); document.removeEventListener("keydown", tecla); };
    var tecla = function (e) { if (e.key === "Escape") cerrar(); };
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest(".ter")) cerrar(); });
    document.addEventListener("keydown", tecla);
    document.body.appendChild(m);
    m.querySelector(".pri").focus();
  };

  window.PPCarrito = { clave: CLAVE, leer: leer, guardar: guardar, agregar: agregar, vaciar: vaciar, unidades: unidades, sesionActiva: sesionActiva, aviso: aviso, pedirLogin: pedirLogin };
})();

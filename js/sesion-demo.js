/* =========================================================
   SESIÓN DE DEMOSTRACIÓN (solo maquetación)
   Lee sessionStorage "rol" (lo escribe login-demo.js) y cambia
   la barra de navegación:
     sin sesión -> botón "Iniciar sesión"
     con sesión -> icono de perfil (con menú) + icono de carrito
                   con el número de productos
   También hace que "Desloguear" cierre la sesión, que el
   registro deje la sesión iniciada y que las pantallas de
   administración pidan sesión de administrador.
   En el sistema real esto lo resuelve PHP con $_SESSION.
   ========================================================= */
(function () {
  var rol = null;
  try { rol = sessionStorage.getItem("rol"); } catch (e) {}

  // El sitio puede estar en la raíz o dentro de /admin/
  var base = location.pathname.indexOf("/admin/") !== -1 ? "../" : "";
  var CLAVE_CARRITO = "pp_carrito_v1";

  /* 0) Protección de las pantallas de administración (solo demo) */
  if (location.pathname.indexOf("/admin/") !== -1 && rol !== "admin") {
    location.replace("../login.html");
    return;
  }

  /* Las pantallas del área de cliente (las que traen el menú de sesión) piden iniciar sesión */
  if (!rol && /\/(perfil|mis-peluditos|historial-pedidos|detalle-pedido|finalizar-compra|orden-confirmada)\.html$/.test(location.pathname)) {
    location.replace("login.html");
    return;
  }

  var icono = function (d, t) {
    return '<svg viewBox="0 0 24 24" width="' + (t || 20) + '" height="' + (t || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  };
  var D_USER = '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>';
  var D_CART = '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6"/>';

  var cerrarSesion = function () { try { sessionStorage.removeItem("rol"); } catch (e) {} };
  var unidades = function () {
    try { return JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]").reduce(function (s, i) { return s + i.cantidad; }, 0); } catch (e) { return 0; }
  };

  var iniciar = function () {
    /* Estilos propios para no depender de cada página */
    var css = document.createElement("style");
    css.textContent =
      ".nav-sesion{display:flex;align-items:center;gap:12px;position:relative}" +
      ".nav-sesion .ic{position:relative;display:grid;place-items:center;width:42px;height:42px;padding:0;color:#0D3B66;background:#fff;border:2px solid #E2E8F0;border-radius:50%;cursor:pointer;transition:border-color .2s,background-color .2s}" +
      ".nav-sesion .ic:hover{background:#FFF8EC;border-color:#FDA12E}" +
      ".nav-sesion .ic-perfil{border-color:#FDA12E;background:#FFF3DC}" +
      ".nav-sesion .ic-perfil::after{content:'';position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;background:#22A06B;border:2px solid #fff;border-radius:50%}" +
      ".nav-sesion .cuenta{position:relative}" +
      ".nav-sesion .cuenta-menu{position:absolute;top:calc(100% + 10px);right:0;z-index:1000;min-width:210px;padding:8px;background:#fff;border:1px solid #E2E8F0;border-radius:12px;box-shadow:0 12px 30px rgba(15,23,42,.18)}" +
      ".nav-sesion .cuenta-menu[hidden]{display:none}" +
      ".nav-sesion .cuenta-menu p{margin:0;padding:8px 12px 10px;font-size:12px;color:#64748B;border-bottom:1px solid #E2E8F0}" +
      ".nav-sesion .cuenta-menu a{display:block;padding:9px 12px;font-size:14px;font-weight:500;color:#1E293B;text-decoration:none;border-radius:8px}" +
      ".nav-sesion .cuenta-menu a:hover{background:#F1F5F9}" +
      ".nav-sesion .cuenta-menu a.salir{margin-top:4px;color:#B91C1C;border-top:1px solid #E2E8F0;border-radius:0 0 8px 8px}" +
      ".nav-sesion .cuenta-menu a.salir:hover{background:#FEE2E2}" +
      ".nav-sesion .cuenta-menu p strong{display:block;font-size:14px;color:#0D3B66}" +
      ".nav-sesion .num{position:absolute;top:-5px;right:-5px;min-width:19px;height:19px;padding:0 5px;font-size:11px;font-weight:700;line-height:19px;text-align:center;color:#0D3B66;background:#FDA12E;border:2px solid #fff;border-radius:999px;box-sizing:content-box}" +
      ".nav-sesion .num[hidden]{display:none}" +
      "@media(max-width:640px){.nav-sesion{gap:8px}.nav-sesion .ic{width:38px;height:38px}.navbar .nav-container{gap:8px}}";
    document.head.appendChild(css);

    /* 1) Barra de navegación según la sesión */
    var anterior = document.querySelector(".btn-login, .nav-user");
    if (rol && anterior) {
      var esAdmin = rol === "admin";
      var cont = document.createElement("div");
      cont.className = "nav-sesion";
      var menu = esAdmin
        ? '<p><strong>Administrador</strong>admin@peluditosypunto.co</p>' +
          '<a href="' + base + 'admin/admin-dashboard.html">Panel de administración</a>' +
          '<a href="' + base + 'index.html">Ver la tienda</a>'
        : '<p><strong>Mi cuenta</strong>Sesión iniciada</p>' +
          '<a href="' + base + 'perfil.html">Información personal</a>' +
          '<a href="' + base + 'mis-peluditos.html">Mis peluditos</a>' +
          '<a href="' + base + 'historial-pedidos.html">Mis pedidos</a>';
      cont.innerHTML =
        '<div class="cuenta">' +
          '<button type="button" class="ic ic-perfil" aria-label="Menú de mi cuenta" aria-haspopup="true" aria-expanded="false" title="Mi cuenta">' + icono(D_USER) + "</button>" +
          '<div class="cuenta-menu" hidden>' + menu + '<a href="' + base + 'index.html" class="salir" data-salir>Cerrar sesión</a></div>' +
        "</div>" +
        (esAdmin ? "" : '<a class="ic ic-carrito" href="' + base + 'carrito.html" aria-label="Carrito" title="Carrito">' + icono(D_CART) + '<span class="num" hidden>0</span></a>');
      anterior.parentNode.replaceChild(cont, anterior);

      /* Menú del perfil */
      var boton = cont.querySelector(".ic-perfil"), panel = cont.querySelector(".cuenta-menu");
      var cerrar = function () { panel.hidden = true; boton.setAttribute("aria-expanded", "false"); };
      boton.addEventListener("click", function (e) {
        e.stopPropagation();
        var abrir = panel.hidden;
        panel.hidden = !abrir; boton.setAttribute("aria-expanded", String(abrir));
      });
      document.addEventListener("click", function (e) { if (!cont.contains(e.target)) cerrar(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });

      /* Número de productos del carrito */
      var num = cont.querySelector(".num");
      var pintar = function () {
        if (!num) return;
        var n = unidades();
        num.textContent = n > 99 ? "99+" : n; num.hidden = n === 0;
        var c = cont.querySelector(".ic-carrito"); if (c) c.setAttribute("aria-label", "Carrito, " + n + (n === 1 ? " producto" : " productos"));
      };
      pintar();
      document.addEventListener("pp:carrito", pintar);
      window.addEventListener("storage", pintar);
    }

    /* 2) "Desloguear" / "Cerrar sesión" cierran la sesión */
    document.addEventListener("click", function (e) {
      if (e.target.closest(".is-logout, [data-salir]")) cerrarSesion();
    });

    /* 3) Registro: deja la sesión iniciada y lleva al inicio */
    var reg = document.getElementById("registerForm");
    if (reg) {
      reg.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!reg.checkValidity()) { reg.reportValidity(); return; }
        try { sessionStorage.setItem("rol", "cliente"); } catch (err) {}
        location.href = "index.html";
      });
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();

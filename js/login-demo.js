/* =========================================================
   LOGIN DE DEMOSTRACIÓN (solo para la maquetación)
   ---------------------------------------------------------
   Esto NO es seguridad real. Cualquiera puede leer este
   archivo y ver la contraseña. Sirve únicamente para mostrar
   el flujo en la sustentación:
     - admin@peluditosypunto.co  /  Admin123  ->  admin/admin-dashboard.html
     - cualquier otro correo con contraseña   ->  index.html (cliente)
   En el desarrollo real, el rol lo valida el servidor (RF17)
   y esta validación se elimina.
   ========================================================= */
(function () {
  var ADMIN_EMAIL = "admin@peluditosypunto.co";
  var ADMIN_PASS = "Admin123";

  var form = document.getElementById("loginForm");
  if (!form) return;

  // Mensaje de error 
  var error = document.createElement("p");
  error.setAttribute("role", "alert");
  error.hidden = true;
  error.style.cssText =
    "margin:0 0 12px;padding:10px 12px;font-size:14px;color:#9b1c1c;" +
    "background:#fdf2f2;border:1px solid #e5b4b4;border-radius:6px;";
  form.insertBefore(error, form.querySelector(".btn-submit"));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var pass = document.getElementById("password").value;

    // Si intenta entrar como admin con clave incorrecta, se rechaza
    if (email === ADMIN_EMAIL && pass !== ADMIN_PASS) {
      error.textContent = "Correo o contraseña incorrectos.";
      error.hidden = false;
      return;
    }

    var rol = email === ADMIN_EMAIL ? "admin" : "cliente";
    try { sessionStorage.setItem("rol", rol); } catch (err) { /* sin almacenamiento */ }

    window.location.href = rol === "admin" ? "admin/admin-dashboard.html" : "index.html";
  });
})();

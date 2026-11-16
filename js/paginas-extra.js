/* Comportamiento de las páginas nuevas (solo maquetación: no envía nada a un servidor). */
(function () {
  /* Contacto */
  var f = document.getElementById("contactForm");
  if (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      f.querySelectorAll(".pe-field").forEach(function (campo) {
        var i = campo.querySelector(".pe-input");
        var bien = i.checkValidity() && i.value.trim() !== "";
        campo.classList.toggle("invalid", !bien);
        if (!bien) ok = false;
      });
      if (!ok) return;
      document.getElementById("contactOk").hidden = false;
      f.reset();
    });
  }

  /* Nueva contraseña */
  var n = document.getElementById("newPassForm");
  if (n) {
    var p1 = document.getElementById("pass1");
    var p2 = document.getElementById("pass2");
    var reglas = {
      largo: function (v) { return v.length >= 8; },
      mayus: function (v) { return /[A-Z]/.test(v); },
      num: function (v) { return /\d/.test(v); }
    };
    var pintar = function () {
      var todas = true;
      Object.keys(reglas).forEach(function (k) {
        var cumple = reglas[k](p1.value);
        document.querySelector('[data-regla="' + k + '"]').classList.toggle("ok", cumple);
        if (!cumple) todas = false;
      });
      return todas;
    };
    p1.addEventListener("input", pintar);
    n.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("passError");
      err.textContent = "";
      if (!pintar()) { err.textContent = "La contraseña no cumple todos los requisitos."; return; }
      if (p1.value !== p2.value) { err.textContent = "Las contraseñas no coinciden."; return; }
      n.hidden = true;
      document.getElementById("passOk").hidden = false;
    });
  }
})();

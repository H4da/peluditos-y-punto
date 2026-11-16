/* =========================================================
   Comportamiento ligero de las pantallas 3, 9, 11 y 12
   (solo maquetación: no guarda nada en servidor todavía)
   ========================================================= */
(function () {
  //  Pantalla 3: mensaje de confirmación 
  var recover = document.getElementById("recoverForm");
  if (recover) {
    recover.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email");
      if (!email.checkValidity()) { email.reportValidity(); return; }
      document.getElementById("recoverMsg").hidden = false;
    });
  }

  //  Pantalla 9: mostrar los campos del método de pago elegido 
  var metodos = document.querySelectorAll('input[name="metodo"]');
  if (metodos.length) {
    var bloques = document.querySelectorAll(".pay-fields");
    var mostrar = function () {
      var elegido = document.querySelector('input[name="metodo"]:checked').value;
      bloques.forEach(function (b) { b.hidden = b.dataset.metodo !== elegido; });
    };
    metodos.forEach(function (m) { m.addEventListener("change", mostrar); });
    mostrar();
  }

  //  Vista previa de imagen 
  function vistaPrevia(inputId, imgId, maxBytes) {
    var input = document.getElementById(inputId);
    var img = document.getElementById(imgId);
    if (!input || !img) return;
    input.addEventListener("change", function () {
      var f = input.files[0];
      if (!f) return;
      if (maxBytes && f.size > maxBytes) {
        alert("La imagen supera el tamaño máximo permitido (800K).");
        input.value = "";
        return;
      }
      img.src = URL.createObjectURL(f);
    });
  }
  vistaPrevia("avatarInput", "avatarPreview", 800 * 1024);
  vistaPrevia("petFoto", "petPreview", 0);

  // Que el botón "label" también funcione con teclado
  document.querySelectorAll('label.btn[for]').forEach(function (l) {
    l.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.getElementById(l.htmlFor).click(); }
    });
  });

  //  Pantalla 12: eliminar / agregar mascota 
  var grid = document.getElementById("petsGrid");
  if (grid) {
    var vacio = document.getElementById("petsEmpty");
    var revisar = function () { vacio.hidden = grid.children.length > 0; };

    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-eliminar]");
      if (!b) return;
      b.closest(".pet-card").remove();
      revisar();
    });

    var form = document.getElementById("petForm");
    // "Otro": pedir qué tipo de mascota es
    var cajaOtro = document.getElementById("otroTipoBox");
    var campoOtro = document.getElementById("otroTipo");
    var verOtro = function () {
      var esOtro = form.querySelector('input[name="tipo"]:checked').value === "Otro";
      cajaOtro.hidden = !esOtro; campoOtro.required = esOtro;
    };
    form.addEventListener("change", verOtro);
    form.addEventListener("reset", function () { setTimeout(verOtro, 0); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = document.getElementById("petNombre").value.trim();
      var raza = document.getElementById("petRaza").value.trim();
      var tipo = form.querySelector('input[name="tipo"]:checked').value;
      if (tipo === "Otro") {
        var otro = document.getElementById("otroTipo");
        if (!otro.value.trim()) { otro.focus(); otro.reportValidity(); return; }
        tipo = otro.value.trim();
      }
      var foto = document.getElementById("petPreview").src;

      var art = document.createElement("article");
      art.className = "card pet-card";
      art.innerHTML =
        '<img alt=""><h3></h3><p></p><span class="pet-badge"></span>' +
        '<button type="button" class="btn btn-danger-outline" data-eliminar>Eliminar</button>';
      art.querySelector("img").src = foto;
      art.querySelector("img").alt = "Foto de " + nombre;
      art.querySelector("h3").textContent = nombre;
      art.querySelector("p").textContent = tipo + (raza ? " · " + raza : "");
      art.querySelector(".pet-badge").textContent = tipo;
      grid.appendChild(art);
      form.reset();
      document.getElementById("petPreview").src = "img/login-animals.png";
      revisar();
    });
  }
})();

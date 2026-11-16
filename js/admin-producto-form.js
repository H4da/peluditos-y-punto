/* Formulario de producto (nuevo / editar con ?id=). Requiere productos.js. Solo maquetación. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var form = $("prodForm"); if (!form) return;
  var id = new URLSearchParams(location.search).get("id");
  var prod = id ? productos.filter(function (p) { return String(p.id) === id; })[0] : null;
  var vars = $("vars");

  var fila = function (t, c, s) {
    var tr = document.createElement("tr");
    tr.innerHTML = '<td><input class="input" aria-label="Talla" value="' + (t || "") + '" placeholder="Única"></td>' +
      '<td><input class="input" aria-label="Color" value="' + (c || "") + '" placeholder="Ej. negro"></td>' +
      '<td><input class="input" aria-label="Stock" type="number" min="0" value="' + (s == null ? 10 : s) + '" style="max-width:90px"></td>' +
      '<td><button type="button" class="btn btn-danger btn-sm" aria-label="Quitar variante">Quitar</button></td>';
    tr.querySelector("button").addEventListener("click", function () { tr.remove(); });
    vars.appendChild(tr);
  };
  $("add-var").addEventListener("click", function () { fila(); });

  if (prod) {
    document.title = "Editar producto | Admin Peluditos y Punto";
    $("top-h1").textContent = "Editar producto";
    $("top-sub").textContent = prod.nombre;
    $("p-nombre").value = prod.nombre; $("p-tipo").value = prod.tipo; $("p-precio").value = prod.precio;
    $("p-desc").value = prod.descripcion; $("p-mat").value = prod.materiales || "";
    document.querySelectorAll("#p-diseno input").forEach(function (c) { c.checked = prod.diseno.indexOf(c.value) !== -1; });
    var tallas = prod.tallas.length ? prod.tallas : [""];
    tallas.forEach(function (t) { prod.colores.forEach(function (c) { fila(t, c, 10); }); });
    document.querySelectorAll("#slots .img-slot").forEach(function (s, k) {
      if (prod.imagenes[k]) { var im = document.createElement("img"); im.src = "../" + prod.imagenes[k]; im.alt = "Foto " + (k + 1); s.appendChild(im); }
    });
  } else { fila("", "", 10); }

  /* Vista previa al elegir una foto */
  document.querySelectorAll("#slots input").forEach(function (inp) {
    inp.addEventListener("change", function () {
      var f = inp.files[0]; if (!f) return;
      var slot = inp.parentNode, im = slot.querySelector("img");
      if (!im) { im = document.createElement("img"); slot.appendChild(im); }
      im.src = URL.createObjectURL(f);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll(".field").forEach(function (f) {
      var i = f.querySelector("[required]"); if (!i) return;
      var bien = i.value.trim() !== "" && i.checkValidity();
      f.classList.toggle("invalid", !bien); if (!bien) ok = false;
    });
    if (!ok) { var primero = form.querySelector(".invalid [required]"); if (primero) primero.focus(); return; }
    $("ok").hidden = false;
    setTimeout(function () { $("ok").hidden = true; }, 3500);
  });
})();

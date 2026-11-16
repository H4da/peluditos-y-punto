/* =========================================================
   Vista de detalle: carga el producto según id= de la dirección
   Requiere productos.js cargado antes que este archivo.
   ========================================================= */
(function () {
  const params = new URLSearchParams(window.location.search);
  const idPedido = params.get("id");

  // Si no viene id, se muestra el primer producto
  const producto = idPedido
    ? productos.find(function (p) { return String(p.id) === idPedido; })
    : productos[0];

  const main = document.querySelector(".site-main");

  if (!producto) {
    main.innerHTML =
      '<p style="padding:40px 0;font-size:18px;">No encontramos este producto. ' +
      '<a href="tienda-pod.html" style="text-decoration:underline;">Volver al catálogo</a></p>';
    return;
  }

  const precio = function (valor) { return "$" + valor.toLocaleString("es-CO"); };
  const porId = function (id) { return document.getElementById(id); };
  const capitalizar = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };

  /*  Textos */
  document.title = producto.nombre + " | Peluditos y Punto";
  porId("bc-categoria").textContent = producto.categoria;
  porId("bc-nombre").textContent = producto.nombre;
  porId("producto-nombre").textContent = producto.nombre;
  porId("producto-precio").textContent = precio(producto.precio);
  porId("producto-descripcion").textContent = producto.descripcion;
  porId("producto-materiales").textContent = producto.materiales;
  porId("producto-categoria").textContent = producto.categoria;

  /* Galería  */
  const principal = porId("imagen-principal");
  const contenedorMiniaturas = porId("miniaturas");

  principal.src = producto.imagenes[0];
  principal.alt = producto.nombre;

  // Zona donde se dibuja el producto en el color elegido (ver vista-previa.js)
  const zonaMockup = document.createElement("div");
  zonaMockup.id = "mockup-principal";
  zonaMockup.style.display = "none";
  principal.parentNode.appendChild(zonaMockup);
  const mostrarFoto = function () { zonaMockup.style.display = "none"; principal.style.display = ""; };
  const mostrarMockup = function () { principal.style.display = "none"; zonaMockup.style.display = "grid"; };

  if (producto.imagenes.length > 1) {
    producto.imagenes.forEach(function (ruta, i) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "thumb" + (i === 0 ? " is-active" : "");
      boton.setAttribute("aria-label", "Ver imagen " + (i + 1));
      boton.innerHTML = '<img src="' + ruta + '" alt="">';
      boton.addEventListener("click", function () {
        mostrarFoto();
        principal.src = ruta;
        contenedorMiniaturas.querySelectorAll(".thumb").forEach(function (t) {
          t.classList.remove("is-active");
        });
        boton.classList.add("is-active");
      });
      contenedorMiniaturas.appendChild(boton);
    });
  } else {
    contenedorMiniaturas.style.display = "none"; // una sola foto: no hay miniaturas
  }

  /* Tallas. si el producto no tiene, se oculta el grupo */
  if (producto.tallas.length === 0) {
    porId("grupo-talla").style.display = "none";
  } else {
    porId("opciones-talla").innerHTML = producto.tallas.map(function (t, i) {
      return (
        '<input type="radio" name="talla" id="talla-' + t + '" value="' + t + '"' + (i === 0 ? " checked" : "") + '>' +
        '<label for="talla-' + t + '">' + t + '</label>'
      );
    }).join("");
  }
  porId("enlace-guia").href =
    "guia-tallas.html#" + (producto.tipo === "pañoletas" ? "panoletas" : "camisetas");

  /* Colores y si el producto no tiene, se oculta el grupo */
  if (producto.colores.length === 0) {
    porId("grupo-color").style.display = "none";
  } else {
    porId("opciones-color").innerHTML = producto.colores.map(function (c, i) {
      return (
        '<input type="radio" name="color" id="color-' + c + '" value="' + c + '"' + (i === 0 ? " checked" : "") + '>' +
        '<label for="color-' + c + '" class="swatch swatch-' + c + '" title="' + capitalizar(c) + '">' +
          '<span class="sr-only">' + capitalizar(c) + '</span>' +
        '</label>'
      );
    }).join("");
  }

  /* Color, texto y foto: cambian la imagen y alimentan la vista previa */
  const form = porId("form-producto");
  const valor = function (nombre) {
    const r = form.querySelector('input[name="' + nombre + '"]:checked');
    return r ? r.value : "";
  };
  let fotoUrl = "", fotoNombre = "";
  porId("foto-mascota").addEventListener("change", function () {
    const f = this.files[0];
    fotoNombre = f ? f.name : "";
    fotoUrl = f ? URL.createObjectURL(f) : "";
    refrescar();
  });
  const dibujarMockup = function (destino) {
    destino.innerHTML = PPVista.svg(producto.tipo, valor("color"), porId("texto-personalizado").value.trim(), fotoUrl);
  };
  const refrescar = function () {
    if (zonaMockup.style.display !== "none") dibujarMockup(zonaMockup);
    if (modal) dibujarMockup(modal.querySelector(".pv-lienzo"));
  };
  form.addEventListener("change", function (e) {
    if (e.target.name !== "color") { if (modal) refrescar(); return; }
    const foto = producto.imagenesPorColor && producto.imagenesPorColor[e.target.value];
    if (foto) { mostrarFoto(); principal.src = foto; }
    else mostrarMockup();
    refrescar();
    if (modal) modal.querySelectorAll(".pv-color").forEach(function (b) { b.classList.toggle("is-active", b.dataset.color === e.target.value); });
  });
  porId("texto-personalizado").addEventListener("input", refrescar);

  /* Vista previa en ventana */
  let modal = null;
  const cerrarModal = function () { if (modal) { modal.remove(); modal = null; document.removeEventListener("keydown", teclaModal); } };
  const teclaModal = function (e) { if (e.key === "Escape") cerrarModal(); };
  porId("btn-vista-previa").addEventListener("click", function () {
    cerrarModal();
    modal = document.createElement("div");
    modal.className = "pv-modal";
    const chips = producto.colores.map(function (c) {
      return '<button type="button" class="pv-color swatch-' + c + (c === valor("color") ? " is-active" : "") + '" data-color="' + c + '" title="' + capitalizar(c) + '" aria-label="' + capitalizar(c) + '"></button>';
    }).join("");
    modal.innerHTML =
      '<div class="pv-box" role="dialog" aria-modal="true" aria-labelledby="pv-titulo">' +
        '<div class="pv-head"><h2 id="pv-titulo">Vista previa</h2><button type="button" class="pv-x" aria-label="Cerrar">&times;</button></div>' +
        '<div class="pv-body"><div class="pv-lienzo"></div>' +
          '<div class="pv-lado"><p class="pv-nombre">' + producto.nombre + '</p>' +
          (producto.colores.length ? '<p class="pv-etq">Color</p><div class="pv-colores">' + chips + '</div>' : "") +
          '<p class="pv-nota">Es una representación aproximada. Los colores y la posición del diseño pueden variar levemente en el producto final.</p>' +
          '<div class="pv-acc"><button type="button" class="btn btn-dark pv-agregar">Añadir al carrito</button><button type="button" class="btn btn-outline pv-cerrar">Seguir editando</button></div></div></div>' +
      '</div>';
    document.body.appendChild(modal);
    document.addEventListener("keydown", teclaModal);
    dibujarMockup(modal.querySelector(".pv-lienzo"));
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".pv-x, .pv-cerrar")) { cerrarModal(); return; }
      const c = e.target.closest(".pv-color");
      if (c) { const r = form.querySelector('input[name="color"][value="' + c.dataset.color + '"]'); r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
      if (e.target.closest(".pv-agregar")) { cerrarModal(); form.requestSubmit(); }
    });
    modal.querySelector(".pv-cerrar").focus();
  });

  /* Añadir al carrito (con las opciones elegidas) */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!PPCarrito.sesionActiva()) { PPCarrito.pedirLogin(); return; }
    PPCarrito.agregar({ id: producto.id, color: valor("color"), talla: valor("talla"), texto: porId("texto-personalizado").value.trim(), imagen: fotoNombre });
    PPCarrito.aviso("“" + producto.nombre + "” se añadió al carrito.", "Ver carrito", "carrito.html");
  });

  /* Productos relacionados */
  let relacionados;
  if (producto.relacionados) {
    relacionados = producto.relacionados.map(function (id) {
      return productos.find(function (p) { return p.id === id; });
    }).filter(Boolean);
  } else {
    // Por defecto: primero los del mismo tipo, luego el resto
    relacionados = productos.filter(function (p) { return p.id !== producto.id; });
    relacionados.sort(function (a, b) {
      return (b.tipo === producto.tipo) - (a.tipo === producto.tipo);
    });
  }

  porId("relacionados").innerHTML = relacionados.slice(0, 4).map(function (p) {
    return (
      '<a href="producto-pod.html?id=' + p.id + '" class="related-card">' +
        '<div class="related-image"><img src="' + p.imagenes[0] + '" alt="' + p.nombre + '"></div>' +
        '<div class="related-body"><h3>' + p.nombre + '</h3><p>' + precio(p.precio) + '</p></div>' +
      '</a>'
    );
  }).join("");
})();
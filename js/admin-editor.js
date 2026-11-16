/* =========================================================
   Editor de artículos (funcional con localStorage)
   Requiere: articulos.js, admin-store.js
   ========================================================= */
(function () {
  const $ = function (id) { return document.getElementById(id); };
  const esc = function (t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  const params = new URLSearchParams(location.search);
  const idEditar = params.get("id");
  let post = idEditar ? BlogStore.obtener(idEditar) : null;

  //  Categorías 
  const cats = categoriasBlog.slice();
  if (post && post.categoria && cats.indexOf(post.categoria) < 0) cats.push(post.categoria);
  $("cat").innerHTML = cats.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("");

  //  Afiliados 
  const lista = $("afiliadosLista");
  function filaAfiliado(a, n) {
    const d = document.createElement("div");
    d.className = "aff-item";
    d.innerHTML =
      '<div class="row"><strong>Enlace ' + n + '</strong>' +
      '<button type="button" class="btn btn-danger btn-sm" data-quitar>Quitar</button></div>' +
      '<div class="field"><label>Producto</label><input class="input" data-f="nombre" value="' + esc(a.nombre || "") + '"></div>' +
      '<div class="field" style="margin-top:8px"><label>URL de afiliado</label>' +
      '<input class="input" data-f="url" type="url" placeholder="https://…" value="' + esc(a.url || "") + '"></div>';
    return d;
  }
  function renumerar() {
    lista.querySelectorAll(".aff-item").forEach(function (el, i) { el.querySelector("strong").textContent = "Enlace " + (i + 1); });
  }
  $("agregarAfiliado").addEventListener("click", function () {
    lista.appendChild(filaAfiliado({}, lista.children.length + 1));
  });
  lista.addEventListener("click", function (e) {
    const b = e.target.closest("[data-quitar]");
    if (b) { b.closest(".aff-item").remove(); renumerar(); }
  });

  //  Cargar datos 
  const estadoPill = $("estadoPill");
  if (post) {
    $("titulo").value = post.titulo;
    $("cat").value = post.categoria;
    $("tags").value = post.etiquetas || "";
    $("fecha").value = post.fecha || "";
    $("cuerpo").innerHTML = post.contenido || "";
    (post.afiliados || []).forEach(function (a, i) { lista.appendChild(filaAfiliado(a, i + 1)); });
    estadoPill.textContent = BlogStore.estadoReal(post);
    document.querySelector(".adm-top h1").textContent = "Editar artículo";
  } else {
    $("cuerpo").innerHTML = "<p></p>";
  }

  //  Barra de formato 
  const cuerpo = $("cuerpo");
  document.querySelector(".wys-bar").addEventListener("mousedown", function (e) {
    if (e.target.closest("button")) e.preventDefault();   // no perder la selección
  });
  document.querySelector(".wys-bar").addEventListener("click", function (e) {
    const b = e.target.closest("button");
    if (!b) return;
    cuerpo.focus();
    if (b.dataset.cmd) document.execCommand(b.dataset.cmd, false, null);
    if (b.dataset.block) document.execCommand("formatBlock", false, b.dataset.block);
  });
  $("btnLink").addEventListener("click", function () {
    const url = prompt("Escribe la dirección del enlace (https://…)");
    if (url) { cuerpo.focus(); document.execCommand("createLink", false, url); }
  });
  $("btnImg").addEventListener("click", function () { $("imgInput").click(); });
  $("imgInput").addEventListener("change", function () {
    const f = this.files[0]; this.value = "";
    if (!f) return;
    if (f.size > 400 * 1024) { alert("La imagen es muy pesada para esta demo (máximo 400 KB)."); return; }
    const r = new FileReader();
    r.onload = function () {
      cuerpo.focus();
      document.execCommand("insertHTML", false, '<img src="' + r.result + '" alt="" style="max-width:100%">');
    };
    r.readAsDataURL(f);
  });
  $("portada").addEventListener("change", function () {
    if (this.files[0]) $("portadaTxt").textContent = this.files[0].name;
  });

  //  Guardar 
  function reunir(estado) {
    const titulo = $("titulo").value.trim();
    if (!titulo) { $("titulo").focus(); alert("Escribe un título para el artículo."); return null; }
    const hoy = BlogStore.hoy();
    let fecha = $("fecha").value || hoy;
    if (estado === "Publicar") estado = fecha > hoy ? "Programado" : "Publicado";
    const afiliados = Array.prototype.map.call(lista.querySelectorAll(".aff-item"), function (el) {
      return { nombre: el.querySelector('[data-f="nombre"]').value.trim(), url: el.querySelector('[data-f="url"]').value.trim() };
    }).filter(function (a) { return a.nombre || a.url; });
    const texto = cuerpo.textContent.trim();
    return {
      id: post ? post.id : null,
      titulo: titulo,
      categoria: $("cat").value,
      etiquetas: $("tags").value.trim(),
      fecha: fecha,
      estado: estado,
      contenido: cuerpo.innerHTML,
      extracto: texto.slice(0, 160),
      afiliados: afiliados
    };
  }
  function guardar(estado, mensaje) {
    const datos = reunir(estado);
    if (!datos) return;
    if (!BlogStore.guardar(datos)) { alert("No se pudo guardar (almacenamiento del navegador lleno o bloqueado)."); return; }
    try { sessionStorage.setItem("pp_aviso", mensaje(datos.estado)); } catch (e) {}
    location.href = "admin-blog.html";
  }
  $("btnBorrador").addEventListener("click", function () {
    guardar("Borrador", function () { return "Borrador guardado"; });
  });
  $("btnPublicar").addEventListener("click", function () {
    guardar("Publicar", function (e) { return e === "Programado" ? "Artículo programado" : "Artículo publicado"; });
  });

  // ----- Previsualizar (alterna editor / vista previa) -----
  $("btnPrevia").addEventListener("click", function () {
    const ver = $("panelPrevia").hidden;
    if (ver) {
      $("prevTitulo").textContent = $("titulo").value || "(Sin título)";
      $("prevMeta").textContent = $("cat").value + " · " + ($("fecha").value || BlogStore.hoy());
      $("prevCuerpo").innerHTML = cuerpo.innerHTML;
    }
    $("panelPrevia").hidden = !ver;
    $("panelEditor").hidden = ver;
    this.textContent = ver ? "Volver a editar" : "Previsualizar";
  });
})();

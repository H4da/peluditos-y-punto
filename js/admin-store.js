/* =========================================================
   Almacén de artículos del panel admin (PARA MAQUETACIÓN)
   Guarda en localStorage del navegador, sin servidor.
   Se llena la primera vez con los artículos reales de articulos.js.
   Requiere articulos.js cargado antes.
   ========================================================= */
const BlogStore = (function () {
  const CLAVE = "pp_admin_blog_v1";

  const hoy = function () {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + dia;
  };

  const semilla = function () {
    return articulos.map(function (a) {
      return {
        id: a.id, titulo: a.titulo, categoria: a.categoria, fecha: a.fecha,
        estado: "Publicado", etiquetas: "", contenido: a.contenido || "",
        extracto: a.extracto || "", afiliados: []
      };
    });
  };

  const leer = function () {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) return JSON.parse(crudo);
    } catch (e) { /* sin almacenamiento */ }
    const inicial = semilla();
    escribir(inicial);
    return inicial;
  };

  function escribir(lista) {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista)); return true; }
    catch (e) { return false; }
  }

  return {
    hoy: hoy,
    todos: leer,
    obtener: function (id) {
      return leer().find(function (p) { return String(p.id) === String(id); }) || null;
    },
    guardar: function (post) {
      const lista = leer();
      if (post.id == null) {
        post.id = lista.reduce(function (m, p) { return Math.max(m, p.id); }, 0) + 1;
        lista.push(post);
      } else {
        const i = lista.findIndex(function (p) { return p.id === post.id; });
        if (i >= 0) lista[i] = post; else lista.push(post);
      }
      return escribir(lista) ? post : null;
    },
    eliminar: function (id) {
      escribir(leer().filter(function (p) { return String(p.id) !== String(id); }));
    },
    restablecer: function () {
      try { localStorage.removeItem(CLAVE); } catch (e) {}
    },
    // El artículo Programado cuya fecha ya llegó, pasa a Publicado
    estadoReal: function (p) {
      if (p.estado === "Programado" && p.fecha <= hoy()) return "Publicado";
      return p.estado;
    }
  };
})();

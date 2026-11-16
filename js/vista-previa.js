/* =========================================================
   Vista previa del producto personalizado (solo maquetación)
   Dibuja la prenda/mug/pañoleta en el color elegido y encima el
   texto y la foto de la mascota. Sirve para:
     - cambiar la imagen principal al elegir un color
     - abrir la ventana "Vista previa" con el diseño completo
   Las fotos reales por color se pueden añadir en productos.js
   con  imagenesPorColor: { rojo: "img/camiseta-roja.jpg" }
   ========================================================= */
window.PPVista = (function () {
  var COLORES = { morado: "#c24de8", rojo: "#b91c1c", azul: "#3b82f6", negro: "#111827", blanco: "#ffffff" };
  var esc = function (t) { return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };

  // luminosidad aproximada para elegir un texto legible
  var oscuro = function (hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  };

  var FORMAS = {
    camisetas: { d: "M130 40 L60 80 L20 150 L75 180 L100 150 L100 360 Q100 372 112 372 L288 372 Q300 372 300 360 L300 150 L325 180 L380 150 L340 80 L270 40 Q250 72 200 72 Q150 72 130 40 Z", cx: 200, cy: 190, ancho: 130 },
    pañoletas: { d: "M40 80 L360 80 Q368 82 362 92 L222 328 Q200 356 178 328 L38 92 Q32 82 40 80 Z", cx: 200, cy: 165, ancho: 120 },
    mugs:      { d: "M105 80 L285 80 L285 300 Q285 330 255 330 L135 330 Q105 330 105 300 Z M285 130 Q345 130 345 195 Q345 260 285 260 L285 238 Q320 238 320 195 Q320 152 285 152 Z", cx: 195, cy: 200, ancho: 120 }
  };

  var svg = function (tipo, color, texto, foto) {
    var f = FORMAS[tipo] || FORMAS.camisetas;
    var hex = COLORES[color] || "#e2e8f0";
    var tinta = oscuro(hex) ? "#ffffff" : "#0D3B66";
    var y = f.cy;
    var diseno = "";
    if (foto) {
      diseno += '<defs><clipPath id="pp-clip"><circle cx="' + f.cx + '" cy="' + (y - 14) + '" r="46"/></clipPath></defs>' +
        '<image href="' + esc(foto) + '" x="' + (f.cx - 46) + '" y="' + (y - 60) + '" width="92" height="92" preserveAspectRatio="xMidYMid slice" clip-path="url(#pp-clip)"/>' +
        '<circle cx="' + f.cx + '" cy="' + (y - 14) + '" r="46" fill="none" stroke="' + tinta + '" stroke-width="3"/>';
      y += 58;
    } else if (!texto) {
      diseno += '<text x="' + f.cx + '" y="' + y + '" text-anchor="middle" font-size="15" fill="' + tinta + '" opacity=".55">Tu diseño aquí</text>';
    }
    if (texto) {
      var tam = texto.length > 10 ? 22 : 30;
      diseno += '<text x="' + f.cx + '" y="' + (foto ? y : y + 8) + '" text-anchor="middle" font-size="' + tam + '" font-weight="700" fill="' + tinta + '" font-family="Inter,Arial,sans-serif">' + esc(texto) + '</text>';
    }
    return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vista previa del producto">' +
      '<defs><linearGradient id="pp-sombra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>' +
      '<path d="' + f.d + '" fill="' + hex + '" fill-rule="evenodd" stroke="#94a3b8" stroke-width="2"/>' +
      '<path d="' + f.d + '" fill="url(#pp-sombra)" fill-rule="evenodd"/>' + diseno + '</svg>';
  };

  return { svg: svg, colores: COLORES };
})();

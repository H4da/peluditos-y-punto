/* =========================================================
   Pedidos de ejemplo (solo maquetación).
   Cuando exista el backend (PHP + MySQL) estos datos vendrán
   de la base de datos; las páginas ya usan esta misma forma.
   estados: recibido -> produccion -> enviado -> entregado (o cancelado)
   ========================================================= */
var estadosPedido = [
  { id: "recibido",   texto: "Recibido",      detalle: "Pago aprobado. Pronto empezamos a producir tu pedido." },
  { id: "produccion", texto: "En producción", detalle: "Estamos imprimiendo y preparando tus productos." },
  { id: "enviado",    texto: "Enviado",       detalle: "Tu pedido va en camino con la transportadora." },
  { id: "entregado",  texto: "Entregado",     detalle: "El pedido fue entregado. ¡Que lo disfruten!" }
];

var pedidosDemo = [
  {
    codigo: "ORD-987654321", fecha: "2026-11-10", estado: "recibido", entrega: "15 – 20 de noviembre de 2026",
    envio: 15000, metodo: "Tarjeta de crédito",
    direccion: "Calle 123 # 45 - 67, Apto 801", ciudad: "Bogotá", telefono: "300 123 4567",
    items: [
      { nombre: "Pañoleta “Patitas Felices”", imagen: "img/panoleta-feliz.png", detalle: "Color: Rojo | Talla: M", cantidad: 1, precio: 18000, id: 3 },
      { nombre: "Camiseta “Mi Humano Favorito”", imagen: "img/camiseta-humano-fav.jpg", detalle: "Color: Negro | Talla: L", cantidad: 1, precio: 45000, id: 1 }
    ]
  },
  {
    codigo: "ORD-987601155", fecha: "2026-11-02", estado: "produccion", entrega: "10 – 14 de noviembre de 2026",
    envio: 15000, metodo: "PSE",
    direccion: "Calle 123 # 45 - 67, Apto 801", ciudad: "Bogotá", telefono: "300 123 4567",
    items: [
      { nombre: "Mug “Amor de Bigotes”", imagen: "img/mug-bigotes.png", detalle: "Color: Blanco", cantidad: 2, precio: 25000, id: 2 }
    ]
  },
  {
    codigo: "ORD-987544820", fecha: "2026-10-21", estado: "enviado", entrega: "28 – 31 de octubre de 2026",
    envio: 15000, metodo: "Nequi", guia: "SER-4471820035",
    direccion: "Calle 123 # 45 - 67, Apto 801", ciudad: "Bogotá", telefono: "300 123 4567",
    items: [
      { nombre: "Camiseta “Dog Mom”", imagen: "img/dog-mom.jpg", detalle: "Color: Blanco | Talla: S", cantidad: 1, precio: 45000, id: 5 },
      { nombre: "Mug “Gato Consentido”", imagen: "img/gato-consentido.png", detalle: "Color: Blanco", cantidad: 1, precio: 24500, id: 6 }
    ]
  },
  {
    codigo: "ORD-987310072", fecha: "2026-09-30", estado: "entregado", entrega: "Entregado el 8 de octubre de 2026",
    envio: 15000, metodo: "Tarjeta de crédito", guia: "SER-4469002817",
    direccion: "Calle 123 # 45 - 67, Apto 801", ciudad: "Bogotá", telefono: "300 123 4567",
    items: [
      { nombre: "Pañoleta “Las 4 estaciones”", imagen: "img/panoleta-4-estaciones.png", detalle: "Color: Azul | Talla: M", cantidad: 1, precio: 30000, id: 7 }
    ]
  },
  {
    codigo: "ORD-987002913", fecha: "2026-09-12", estado: "cancelado", entrega: "Pedido cancelado",
    envio: 15000, metodo: "Tarjeta de crédito",
    direccion: "Calle 123 # 45 - 67, Apto 801", ciudad: "Bogotá", telefono: "300 123 4567",
    items: [
      { nombre: "Camiseta “Sol y Luna”", imagen: "img/camiseta-sol-y-luna.png", detalle: "Color: Negro | Talla: M", cantidad: 1, precio: 45000, id: 8 }
    ]
  }
];

function totalPedido(p) {
  return p.items.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0) + p.envio;
}

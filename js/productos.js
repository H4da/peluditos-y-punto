/* =========================================================
   Datos de los productos de Peluditos y Punto
   Un bloque por producto. El "id" viaja en el enlace del catálogo:
   producto-pod.html?id=3
   ========================================================= */

const productos = [
  {
    id: 1,
    nombre: "Camiseta “Mi Humano Favorito”",
    precio: 45000,
    tipo: "camisetas",
    diseno: ["nombre","imagen"],
    fecha: "2026-10-20",
    categoria: "Camisetas",
    imagenes: ["img/camiseta-humano-fav.jpg","img/camiseta-humano-fav-2.jpg","img/camiseta-humano-fav-3.jpg"],
    descripcion: "Camiseta cómoda y de buena caída, con un diseño pensado para presumir a tu mejor amigo. Personalízala con su nombre o con una fotografía.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul", "negro"]
  },
  {
    id: 2,
    nombre: "Mug “Amor de Bigotes”",
    precio: 25000,
    tipo: "mugs",
    diseno: ["nombre","prediseñado"],
    fecha: "2026-10-05",
    categoria: "Mugs",
    imagenes: ["img/mug-bigotes.png","img/mug-bigotes-2.png","img/mug-bigotes-3.jpg"],
    descripcion: "Mug resistente con un diseño lleno de personalidad felina. Ideal para el café de la mañana y para regalar.",
    materiales: "Cerámica",
    tallas: [],
    colores: ["blanco", "negro"]
  },
  {
    id: 3,
    nombre: "Pañoleta “Patitas Felices”",
    precio: 18000,
    tipo: "pañoletas",
    diseno: ["nombre","imagen"],
    fecha: "2026-09-28",
    categoria: "Accesorios",
    imagenes: ["img/panoleta-feliz.png","img/panoleta-feliz-2.jpg","img/panoleta-feliz-3.jpg"],
    descripcion: "Pañoleta suave y resistente, pensada para el uso diario de tu mascota. Personalízala con su nombre o con una fotografía para que luzca un diseño único.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul"],
    relacionados: [4, 1, 7, 8]   
  },
  {
    id: 4,
    nombre: "Pañoleta “Mi Mejor Amigo”",
    precio: 25000,
    tipo: "pañoletas",
    diseno: ["prediseñado"],
    fecha: "2026-09-15",
    categoria: "Accesorios",
    imagenes: ["img/panoleta-mi-mejor-amigo.jpg","img/panoleta-mi-mejor-amigo-2.jpg","img/panoleta-mi-mejor-amigo-3.jpg"],
    descripcion: "Pañoleta con un diseño tierno para el compañero de todas tus aventuras. Suave, cómoda y fácil de lavar.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul"]
  },
  {
    id: 5,
    nombre: "Camiseta “Dog Mom”",
    precio: 45000,
    tipo: "camisetas",
    diseno: ["nombre","prediseñado"],
    fecha: "2026-10-12",
    categoria: "Camisetas",
    imagenes: ["img/dog-mom.jpg","img/dog-mom-2.jpg","img/dog-mom-3.jpg"],
    descripcion: "Camiseta para las mamás de cuatro patas, con un diseño único y de excelente calidad de impresión.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul", "negro"]
  },
  {
    id: 6,
    nombre: "Mug “Gato Consentido”",
    precio: 24500,
    tipo: "mugs",
    diseno: ["prediseñado"],
    fecha: "2026-10-01",
    categoria: "Mugs",
    imagenes: ["img/gato-consentido.png","img/gato-consentido-2.jpg","img/gato-consentido-3.jpg"],
    descripcion: "Mug negro con un diseño especial para quienes tienen un gato que manda en casa.",
    materiales: "Cerámica",
    tallas: [],
    colores: ["blanco", "negro"]
  },
  {
    id: 7,
    nombre: "Pañoleta “Las 4 estaciones”",
    precio: 30000,
    tipo: "pañoletas",
    diseno: ["prediseñado"],
    fecha: "2026-08-30",
    categoria: "Accesorios",
    imagenes: ["img/panoleta-4-estaciones.png","img/panoleta-4-estaciones-2.jpg","img/panoleta-4-estaciones-3.jpg"],      
    descripcion: "Pañoleta con un diseño inspirado en las cuatro estaciones del año, para lucir a tu mascota en cualquier temporada.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul"]
  },
  {
    id: 8,
    nombre: "Camiseta “Sol y Luna”",
    precio: 45000,
    tipo: "camisetas",
    diseno: ["prediseñado"],
    fecha: "2026-10-25",
    categoria: "Camisetas",
    imagenes: ["img/camiseta-sol-y-luna.png","img/camiseta-sol-y-luna-2.jpg","img/camiseta-sol-y-luna-3.jpg"],        
    descripcion: "Camiseta con un diseño de sol y luna, ideal para quienes comparten el día y la noche con su mascota.",
    materiales: "100% Algodón",
    tallas: ["S", "M", "L"],
    colores: ["morado", "rojo", "azul", "negro"]
  }
];
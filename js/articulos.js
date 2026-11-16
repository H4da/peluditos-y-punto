/* =========================================================
   Datos del blog de Peluditos y Punto
   Un bloque por artículo. 
   ========================================================= */

const categoriasBlog = [
  "Adiestramiento",
  "Salud y bienestar",
  "Nutrición",
  "Reseña de productos"
];

// Texto provisional para los artículos que aún no existen 
const textoProvisional = "<p><em>Contenido de ejemplo: este artículo se publicará próximamente.</em></p>";
const extractoProvisional = "Artículo de ejemplo que se publicará próximamente.";

const articulos = [
  {
    id: 1,
    titulo: "Nutrición Premium para Perros: La Guía Definitiva para Elevar la Vitalidad de tu Mascota",
    categoria: "Nutrición",
    fecha: "2026-10-12",
    imagen: "img/nutricion-premium.jpg",
    top: false,
    extracto: "Elegir la dieta adecuada para tu perro es una de las decisiones más importantes para garantizar su salud, longevidad y energía diaria.",
    contenido: `
      <p>Elegir la dieta adecuada para tu perro es una de las decisiones más importantes para garantizar su salud, longevidad y energía diaria. En el mercado colombiano, la transición hacia una nutrición premium ha marcado la diferencia en la calidad de vida de miles de mascotas, priorizando proteínas de alto valor biológico y digestibilidad superior.</p>
      <p>Si estás buscando transformar la alimentación de tu compañero de cuatro patas, te mostramos por qué una nutrición balanceada es clave y analizamos dos de las marcas de alimento más reconocidas y recomendadas en Colombia.</p>

      <h3>¿Por qué elegir alimento para perros de categoría Premium?</h3>
      <p>A diferencia de los concentrados comerciales tradicionales, la nutrición premium para mascotas formulada con ingredientes de alta calidad ofrece múltiples beneficios:</p>
      <ul>
        <li>Mayor digestibilidad: Proteínas reales como primera fuente de ingrediente, facilitando la absorción de nutrientes.</li>
        <li>Piel sana y pelaje brillante: Niveles óptimos de ácidos grasos esenciales Omega 3 y 6.</li>
        <li>Refuerzo del sistema inmune: Antioxidantes, vitaminas y minerales quelados para prevenir enfermedades.</li>
      </ul>

      <h3>Las 2 Marcas de Alimento Premium Líderes en Colombia</h3>
      <p>Al evaluar la oferta de nutrición canina en el país, dos marcas destacan por su respaldo científico, formulación y excelente aceptación por parte de veterinarios y tutores:</p>

      <h4>1. Chunky (Italcol) – Nutrición Colombiana de Alta Calidad</h4>
      <p>Chunky se ha consolidado como un referente indiscutible en la alimentación canina en Colombia. Formulada con carne real como primer ingrediente, esta línea ofrece una excelente relación costo-beneficio sin comprometer el aporte proteico.</p>
      <ul>
        <li>Puntos fuertes: Sin colorantes artificiales, alta palatabilidad para perros exigentes y fórmulas adaptadas para cada etapa de vida (cachorros, adultos y razas pequeñas).</li>
      </ul>

      <h4>2. Hill’s Science Plan – Nutrición Clínica y Prevención</h4>
      <p>Reconocida globalmente y ampliamente prescrita por médicos veterinarios en Colombia, Hill’s destaca por su enfoque en nutrición basada en la biología.</p>
      <ul>
        <li>Puntos fuertes: Ideal para mascotas con necesidades específicas (sensibilidad digestiva, cuidado articular o control de peso), respaldada por rigurosos estudios científicos.</li>
      </ul>

      <h3>Consejos para una Transición Alimentaria Exitosa</h3>
      <p>Cualquier cambio en la dieta de tu perro debe realizarse de forma gradual durante un período de 7 a 10 días, mezclando progresivamente el nuevo alimento con el anterior para evitar alteraciones gastrointestinales.</p>
    `,
    afiliados: [
      {
        marca: "Chunky",
        producto: "Cordero Arroz y Salmón - Adultos",
        peso: "12 kg",
        imagen: "img/chunky.jpg",
        url: "https://www.example.com/chunky"      // EJEMPLO
      },
      {
        marca: "Hill's Science Plan",
        producto: "Metabolic Sabor a Pollo - Senior",
        peso: "15 kg",
        imagen: "img/hills.jpg",
        url: "https://www.example.com/hills"       
      }
    ]
  },
  {
    id: 2,
    titulo: "Comandos esenciales que todo perro debería conocer",
    categoria: "Adiestramiento",
    fecha: "2026-10-11",
    imagen: "img/adiestramiento.jpg",
    top: false,
    extracto: "Una guía completa para enseñar a tu compañero peludo las órdenes fundamentales que garantizan su seguridad, un buen comportamiento y un vínculo más fuerte en cualquier situación.",
    contenido: textoProvisional
  },
  {
    id: 3,
    titulo: "Reconociendo signos de estrés en gatos",
    categoria: "Salud y bienestar",
    fecha: "2026-10-10",
    imagen: "img/signos-estres.jpg",
    top: false,
    extracto: "Aprende a identificar los cambios sutiles de comportamiento que indican que tu amigo felino podría estar experimentando ansiedad o malestar en su...",
    contenido: textoProvisional
  },
  {
    id: 4,
    titulo: "La guía definitiva sobre dieta barf para tu mascota",
    categoria: "Nutrición",
    fecha: "2026-10-10",
    imagen: "img/barf.jpg",
    top: false,
    extracto: "Exploración de los beneficios, los riesgos y los pasos de transición para cambiar a tu mascota a una dieta de alimentos crudos biológicamente apropiada.",
    contenido: textoProvisional
  },
  {
    id: 5,
    titulo: "Escogiendo la correa correcta para perros de raza grande",
    categoria: "Reseña de productos",
    fecha: "2026-10-05",
    imagen: "img/correa.jpg",
    top: true,
    extracto: extractoProvisional,
    contenido: textoProvisional
  },
  {
    id: 6,
    titulo: "¿Por qué mi gato araña mis muebles?",
    categoria: "Adiestramiento",
    fecha: "2026-09-28",
    imagen: "img/gato-aranando.jpg",
    top: true,
    extracto: extractoProvisional,
    contenido: textoProvisional
  },
  {
    id: 7,
    titulo: "Cuidados básicos para principiantes",
    categoria: "Salud y bienestar",
    fecha: "2026-09-12",
    imagen: "img/cuidados.png",
    top: true,
    extracto: extractoProvisional,
    contenido: textoProvisional
  }
];
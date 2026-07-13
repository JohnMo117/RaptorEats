/**
 * Raptor Eats — Menu Data (Mock)
 *
 * Categories: "De hoy", "Especiales", "Dulces", "Postres", "Bebidas"
 * Each item has: id, category, name, description, price (MXN), image
 *
 * In production, this data would come from a secure backend API over HTTPS.
 */

// Image imports — these reference local assets
// Users should copy the generated images to assets/images/
const IMAGES = {
  tacos: require('../../assets/images/tacos.png'),
  torta: require('../../assets/images/torta.png'),
  quesadilla: require('../../assets/images/quesadilla.png'),
  enchiladas: require('../../assets/images/enchiladas.png'),
  horchata: require('../../assets/images/horchata.png'),
  flan: require('../../assets/images/flan.png'),
};

export const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: 'restaurant-menu' },
  { id: 'hoy', label: 'De hoy', icon: 'today' },
  { id: 'especiales', label: 'Especiales', icon: 'star' },
  { id: 'dulces', label: 'Dulces', icon: 'cake' },
  { id: 'postres', label: 'Postres', icon: 'icecream' },
  { id: 'bebidas', label: 'Bebidas', icon: 'local-cafe' },
];

export const MENU_ITEMS = [
  // ── De hoy ──────────────────────────────────
  {
    id: 'hoy-1',
    category: 'hoy',
    name: 'Tacos de Bistec',
    description: 'Tres tacos de bistec con cilantro, cebolla y salsa verde. Tortilla de maíz recién hecha.',
    price: 55.00,
    prepTime: 10,
    image: IMAGES.tacos,
  },
  {
    id: 'hoy-2',
    category: 'hoy',
    name: 'Torta de Jamón',
    description: 'Bolillo crujiente con jamón, aguacate, lechuga, tomate y jalapeño. Incluye mayonesa.',
    price: 45.00,
    prepTime: 8,
    image: IMAGES.torta,
  },
  {
    id: 'hoy-3',
    category: 'hoy',
    name: 'Quesadilla de Queso',
    description: 'Tortilla de harina con queso Oaxaca derretido. Acompañada de salsa roja.',
    price: 35.00,
    prepTime: 5,
    image: IMAGES.quesadilla,
  },

  // ── Especiales ──────────────────────────────
  {
    id: 'esp-1',
    category: 'especiales',
    name: 'Enchiladas Verdes',
    description: 'Tres enchiladas de pollo bañadas en salsa verde con crema y queso fresco. Con arroz rojo.',
    price: 65.00,
    prepTime: 15,
    image: IMAGES.enchiladas,
  },
  {
    id: 'esp-2',
    category: 'especiales',
    name: 'Torta Especial Raptor',
    description: 'Nuestra torta insignia: milanesa, frijoles, aguacate, queso Oaxaca y chipotle.',
    price: 70.00,
    prepTime: 12,
    image: IMAGES.torta,
  },
  {
    id: 'esp-3',
    category: 'especiales',
    name: 'Tacos al Pastor',
    description: 'Tres tacos al pastor con piña, cilantro y cebolla. Tortilla de maíz artesanal.',
    price: 60.00,
    prepTime: 10,
    image: IMAGES.tacos,
  },

  // ── Dulces ──────────────────────────────────
  {
    id: 'dul-1',
    category: 'dulces',
    name: 'Churros con Chocolate',
    description: 'Cuatro churros espolvoreados con azúcar y canela. Con salsa de chocolate caliente.',
    price: 30.00,
    image: IMAGES.flan,
  },
  {
    id: 'dul-2',
    category: 'dulces',
    name: 'Mazapán Artesanal',
    description: 'Mazapán de cacahuate hecho en casa. Paquete de 3 piezas.',
    price: 20.00,
    image: IMAGES.flan,
  },

  // ── Postres ─────────────────────────────────
  {
    id: 'pos-1',
    category: 'postres',
    name: 'Flan Napolitano',
    description: 'Flan casero de vainilla con caramelo dorado. Porción individual generosa.',
    price: 35.00,
    image: IMAGES.flan,
  },
  {
    id: 'pos-2',
    category: 'postres',
    name: 'Gelatina Mosaico',
    description: 'Gelatina de colores con leche. Decorada con crema batida y cereza.',
    price: 25.00,
    image: IMAGES.flan,
  },

  // ── Bebidas ─────────────────────────────────
  {
    id: 'beb-1',
    category: 'bebidas',
    name: 'Agua de Horchata',
    description: 'Agua fresca de arroz con canela y vainilla. Vaso grande de 500ml.',
    price: 20.00,
    image: IMAGES.horchata,
  },
  {
    id: 'beb-2',
    category: 'bebidas',
    name: 'Agua de Jamaica',
    description: 'Agua fresca de flor de jamaica natural, endulzada al gusto. 500ml.',
    price: 20.00,
    image: IMAGES.horchata,
  },
  {
    id: 'beb-3',
    category: 'bebidas',
    name: 'Jugo de Naranja',
    description: 'Jugo de naranja recién exprimido. Vaso de 350ml.',
    price: 25.00,
    image: IMAGES.horchata,
  },
  {
    id: 'beb-4',
    category: 'bebidas',
    name: 'Café Americano',
    description: 'Café de grano tostado, preparado al momento. Caliente o frío.',
    price: 22.00,
    image: IMAGES.horchata,
  },
  {
    id: 'hoy-4',
    category: 'hoy',
    name: 'Chilaquiles Verdes o Rojos',
    description: 'Totopos bañados en salsa con crema, queso, cebolla y un huevo frito.',
    price: 60.00,
    prepTime: 10,
    image: IMAGES.enchiladas,
  },
  {
    id: 'esp-4',
    category: 'especiales',
    name: 'Enchiladas Suizas',
    description: 'Enchiladas rellenas de pollo, bañadas en salsa verde cremosa y queso gratinado.',
    price: 75.00,
    prepTime: 15,
    image: IMAGES.enchiladas,
  },
  {
    id: 'esp-5',
    category: 'especiales',
    name: 'Hamburguesa Raptor',
    description: 'Carne de res, queso, tocino, lechuga, tomate y papas a la francesa.',
    price: 85.00,
    prepTime: 20,
    image: IMAGES.torta,
  },
  {
    id: 'dul-3',
    category: 'dulces',
    name: 'Galletas Chocochip',
    description: 'Dos galletas horneadas crujientes con chispas de chocolate.',
    price: 15.00,
    image: IMAGES.flan,
  },
  {
    id: 'pos-3',
    category: 'postres',
    name: 'Helado de Vainilla',
    description: 'Dos bolas de helado de vainilla con jarabe de chocolate.',
    price: 25.00,
    image: IMAGES.flan,
  },
  {
    id: 'beb-5',
    category: 'bebidas',
    name: 'Refresco de Cola',
    description: 'Refresco en lata bien frío. 355ml.',
    price: 20.00,
    image: IMAGES.horchata,
  },
];

/**
 * Helper: Get menu items filtered by category
 */
export function getItemsByCategory(categoryId) {
  if (categoryId === 'todos') return MENU_ITEMS;
  return MENU_ITEMS.filter((item) => item.category === categoryId);
}

/**
 * Helper: Get a single item by ID
 */
export function getItemById(itemId) {
  return MENU_ITEMS.find((item) => item.id === itemId);
}

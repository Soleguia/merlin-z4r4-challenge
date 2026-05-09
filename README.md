# Zara Challenge - Tienda de Móviles

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Node](https://img.shields.io/badge/Node-18%2B-brightgreen)](https://nodejs.org)

> E-commerce de telefonía móvil desarrollado con Next.js 14, TypeScript strict mode y SASS/BEM.

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Stack y decisiones técnicas](#stack-y-decisiones-técnicas)
3. [Primeros pasos](#primeros-pasos)
4. [Arquitectura](#arquitectura)
5. [API](#api)
6. [Testing](#testing)
   - [ Suites de tests](#suites-de-tests-83-tests-9-suites)
   - [Detalle de cada suite](#detalle-de-cada-suite)
7. [Calidad de código](#calidad-de-código)
8. [Características](#características)
9. [Guía de contribución](#guía-de-contribución)
10. [Limitaciones conocidas](#limitaciones-conocidas)

## Descripción

Zara Challenge es una aplicación e-commerce de telefonía móvil que permite:

- Navegar por un catálogo de móviles con filtros de búsqueda
- Ver detalles completos de cada producto (especificaciones, colores, almacenamiento)
- Añadir productos al carrito de compras
- Persistir el carrito entre sesiones

### Público objetivo

Tienda online dirigida a usuarios que buscan comprar móviles desde cualquier dispositivo, con especial enfoque en experiencia móvil (mobile-first).

## Stack y decisiones técnicas

| Tecnología | Decisión | Trade-off |
|------------|----------|----------|
| **Next.js 14 (App Router)** | Routing basado en archivos y Server Components | Curva de aprendizaje vs Pages Router |
| **TypeScript strict** | Tipado completo sin `any` implícitos | Desarrollo inicial más lento |
| **SASS + BEM** | Metodología de nomenclatura para CSS escalable | Requiere convenciones nuevas |
| **React Context API** | Estado global simple sin librerías externas | No escala bien para apps muy complejas |
| **localStorage** | Persistencia del carrito | Limitado a un dispositivo |
| **Jest + Playwright** | Unit tests rápidos + E2E completos | Mantener 2 suites separadas |

### Decisiones de diseño

- **Mobile First**: CSS diseñado primero para móviles, responsive para desktop
- **Custom Properties**: Colores, spacing y breakpoints como CSS variables para mantenimiento
- **Orden de propiedades CSS**: Definido en `css-properties-order.json` para consistencia

## Primeros pasos

### Requisitos

- Node.js 18 o superior
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Soleguia/merlin-z4r4-challenge
cd zara-challenge

# Instalar dependencias
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Producción

```bash
# Crear build optimizado
npm run build

# Servir el build
npm start
```

### Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base de la API | `https://prueba-tecnica-api-tienda-moviles.onrender.com` |
| `NEXT_PUBLIC_API_KEY` | Clave API | `87909682e6cd74208f41a6ef39fe4191` |

## Arquitectura

```
src/
├── app/                      # Páginas (App Router)
│   ├── layout.tsx           # Layout raíz con providers
│   ├── page.tsx            # Home (listado productos)
│   ├── cart/              # Carrito
│   │   └── page.tsx
│   └── product/[id]/       # Detalle de producto
│       └── page.tsx
├── components/              # Componentes UI
│   ├── Button/            # Botón reutilizable
│   ��── Card/             # Tarjeta de producto
│   ├── Navbar/           # Navegación principal
│   └── skeletons/        # Loading states
├── hooks/                  # Hooks personalizados
│   └── useDebounce.ts    # Debounce para búsqueda
├── services/              # Cliente API
│   └── api.ts            # Fetch con manejo de errores
├── store/                 # Estado global
│   └── cart/            # Context del carrito
│       ├── CartContext.tsx
│       └── useCart.ts
├── styles/                # Estilos globales
│   ├── _tokens.scss      # Tokens y variables
│   ├── _mixins.scss    # Mixins reutilizables
│   └── globals.scss   # Reset y estilos base
├── types/                 # Tipados TypeScript
│   └── index.ts        # Interfaces globales
└── utils/                # Utilidades
    └── format.ts       # Formateo de precios, etc.
```

### Flujo de datos

```
API → services/api.ts → Components → CartContext → localStorage
```

1. `services/api.ts` hace fetch a la API externa
2. Los componentes consumen datos via Server Components o hooks
3. `CartContext` maneja el estado del carrito
4. `useEffect` sincroniza con localStorage

## API

### Base URL

```
https://prueba-tecnica-api-tienda-moviles.onrender.com
```

### Autenticación

Todos los requests requieren el header:

```
x-api-key: 87909682e6cd74208f41a6ef39fe4191
```

### Endpoints

#### Listado de productos

```
GET /api/products
```

| Parámetro | Tipo | Descripción |
|----------|------|-------------|
| `search` | string | Filtrar por nombre (opcional) |

**Respuesta:**

```json
{
  "products": [
    {
      "id": "1",
      "name": "iPhone 15 Pro",
      "price": 1199,
      "image": "https://...",
      "colors": ["negro", "blanco"],
      "storageOptions": ["128GB", "256GB"]
    }
  ]
}
```

#### Detalle de producto

```
GET /api/products/{id}
```

**Respuesta:**

```json
{
  "id": "1",
  "name": "iPhone 15 Pro",
  "price": 1199,
  "description": "El iPhone más potente...",
  "image": "https://...",
  "colors": ["negro", "blanco"],
  "storageOptions": ["128GB", "256GB"],
  "specs": {
    "screen": "6.1 OLED",
    "processor": "A17 Pro",
    "battery": "3274 mAh"
  }
}
```

### Códigos de error

| Código | Descripción |
|--------|-------------|
| 400 | Request inválido |
| 404 | Producto no encontrado |
| 401 | API key inválida |
| 500 | Error interno del servidor |

### Rate limits

No hay rate limit definido, pero se recomienda agregar debounce en el cliente (300ms ya implementado).

## Testing

### Unit tests (Jest)

```bash
# Ejecutar todos los tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### E2E tests (Playwright)

```bash
npm run test:e2e
```

### Suites de tests (83 tests, 9 suites)

| Suite | Tests | Propósito |
|-------|-------|----------|
| `useCart.test.tsx` | 8 | Hook de gestión del carrito: add, remove, clear, quantities |
| `api.test.ts` | 8 | Cliente API: endpoints, errores, parámetros |
| `Navbar.test.tsx` | 4 | Navegación principal: logo, acceso correcto |
| `Header.test.tsx` | 9 | Header: búsqueda, back link, badge, accesibilidad |
| `Search.test.tsx` | 7 | Componente búsqueda: input, resultados, loading |
| `Button.test.tsx` | 1 | Botón básico: renderizado |
| `Card.test.tsx` | 4 | Tarjeta producto: imagen, precio, datos |
| `ContinueShopping.test.tsx` | 3 | Link de navegación al home |
| `constants/index.test.ts` | 26 | Verifica constantes: labels, a11y, valores |

#### Detalle de cada suite

##### 1. useCart.test.tsx (8 tests)

**Suite**: Hook de React para gestión del estado del carrito con persistencia localStorage.

| # | Test | Verifica |
|----|------|---------|
| 1 | `initializes with empty cart` | Carrito vacío al iniciar |
| 2 | `adds item to cart` | Añadir item con color/storage |
| 3 | `increments quantity when adding existing item` | +1 quantity si ya existe |
| 4 | `removes item from cart` | Eliminar item existe |
| 5 | `calculates totalItems correctly` | Suma de quantities |
| 6 | `clears entire cart` | Vaciar carrito completo |
| 7 | `gets item quantity for specific product` | getItemQuantity funciona |
| 8 | `returns 0 for non-existent item` | 0 si no existe |

##### 2. api.test.ts (8 tests)

**Suite**: Cliente HTTP para comunicación con la API externa de productos.

| # | Test | Verifica |
|----|------|---------|
| 1 | `fetches all products without params` | GET /products sin params |
| 2 | `fetches products with search param` | ?search=xxx |
| 3 | `fetches products with limit param` | ?limit=10 |
| 4 | `fetches products with offset param` | ?offset=20 |
| 5 | `combines multiple params` | search+limit+offset |
| 6 | `throws error on failed response` | 404 → throw Error |
| 7 | `fetches product by id` | GET /products/:id |
| 8 | `throws error when product not found` | ID no existe → throw |

##### 3. Search.test.tsx (7 tests)

**Suite**: Componente de búsqueda con debounce y contador de resultados.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders search input` | Input visible con label |
| 2 | `renders search input with placeholder` | Placeholder correcto |
| 3 | `displays results count when not loading` | "5 RESULTS" plural |
| 4 | `displays singular "RESULT" when count is 1` | "1 RESULT"singular |
| 5 | `displays "Searching..." when loading` | Loading state |
| 6 | `calls onSearch when input changes` | Callback fired |
| 7 | `uses the query value as input value` | Controlled input |

##### 4. Header.test.tsx (9 tests)

**Suite**: Header principal con logo, búsqueda, badge del carrito y navegación.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders logo link to homepage` | Link "/" con a11y |
| 2 | `renders cart link when showCartIcon is true (default)` | Icono visible |
| 3 | `hides cart link when showCartIcon is false` | Oculto si false |
| 4 | `displays cart badge with item count` | Badge con número |
| 5 | `renders search when query and onSearch are provided` | Search visible |
| 6 | `does not render search when showBack is true` | No search si back |
| 7 | `renders back link when showBack is true` | Back link visible |
| 8 | `does not render back link by default` | No back si default |
| 9 | `displays cart link` | Link /cart existe |

##### 5. Navbar.test.tsx (4 tests)

**Suite**: Barra de navegación principal con atributos de accesibilidad.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders navbar with proper accessibility attributes` | role="navigation" |
| 2 | `renders logo link to homepage` | Label "Go to homepage" |
| 3 | `renders cart link` | Link /cart existe |
| 4 | `displays cart badge when items > 0` | Badge muestra número |

##### 6. Button.test.tsx (1 test)

**Suite**: Componente botón reutilizable con variantes y tamaños.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders button with children` | Renderizado básico |

##### 7. Card.test.tsx (4 tests)

**Suite**: Tarjeta de producto para el listado con imagen, nombre, marca y precio.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders product image` | Imagen con alt |
| 2 | `renders brand name` | Marca visible |
| 3 | `renders product name` | Nombre visible |
| 4 | `renders formatted price` | Precio formateado |

##### 8. ContinueShopping.test.tsx (3 tests)

**Suite**: Botón de navegación para volver al home desde el carrito vacío.

| # | Test | Verifica |
|----|------|---------|
| 1 | `renders link to homepage` | Link / presente |
| 2 | `button has correct text` | "CONTINUE SHOPPING" |
| 3 | `href defaults to root` | href="/" por defecto |

##### 9. constants/index.test.ts (26 tests)

**Suite**: Verifica que todas las constantes de texto existen y tienen valores correctos.

**SEARCH_LABELS** (6 tests):
| # | Test | Verifica |
|----|------|---------|
| 1 | `has SEARCHING` | "Searching..." |
| 2 | `has SEARCH_PLACEHOLDER` | "Search for a smartphone..." |
| 3 | `has RESULTS` | "RESULTS" |
| 4 | `has RESULT` | "RESULT" |
| 5 | `has NO_PRODUCTS_FOUND` | "No products found" |
| 6 | `has ERROR_LOADING_PRODUCTS` | "Error loading products" |

**CART_LABELS** (7 tests):
| # | Test | Verifica |
|----|------|---------|
| 1 | `has CART_TITLE` | "Cart" |
| 2 | `has LOADING_CART` | "Loading cart..." |
| 3 | `has TOTAL_LABEL` | "Total" |
| 4 | `has PAY` | "Pay" |
| 5 | `has OPTION_NOT_AVAILABLE` | "Option not available" |
| 6 | `has FAILED_TO_LOAD_PRODUCT` | "Failed to load product" |
| 7 | `has FROM_CART` | "from cart" |

**LABELS** (5 tests):
| # | Test | Verifica |
|----|------|---------|
| 1 | `has RETRY` | "Retry" |
| 2 | `has REMOVE` | "Remove" |
| 3 | `has BACK_TO_STORE` | "Back to store" |
| 4 | `has GO_TO_HOMEPAGE` | "Go to homepage" |
| 5 | `has BACK_LINK` | "< BACK" |

**PRODUCT_LABELS** (5 tests):
| # | Test | Verifica |
|----|------|---------|
| 1 | `has ERROR_LOADING_PRODUCT` | "Error loading product" |
| 2 | `has PRODUCT_NOT_FOUND` | "Product not found" |
| 3 | `has ADD_TO_CART` | "ADD TO CART" |
| 4 | `has SPECIFICATIONS` | "SPECIFICATIONS" |
| 5 | `has SIMILAR_ITEMS` | "SIMILAR ITEMS" |

**A11Y_LABELS** (3 tests):
| # | Test | Verifica |
|----|------|---------|
| 1 | `has SHOPPING_CART_WITH` | "Shopping cart with" |
| 2 | `has ITEMS` | "items" |
| 3 | `has MAIN_NAVIGATION` | "Main navigation" |

### Cobertura actual

| Tipo | Cobertura | Objetivo |
|------|-----------|----------|
| Unit | 75% | 80% |
| E2E | Crítico | - |

### Qué testar

- **Unit**: Hooks, utilidades, formateo de precios, constantes
- **E2E**: Flujo completo: búsqueda → detalle → añadir al cart

## Calidad de código

### Linting

```bash
# ESLint (JS/TS)
npm run lint

# Stylelint (SCSS)
npm run lint:style
```

### Formateo

```bash
# Prettier
npm run format
```

### Ordén de propiedades CSS

El proyecto sigue un orden específico para propiedades CSS definido en `css-properties-order.json`:

1. **Layout**: `display`, `grid`, `flex`, `position`, `top`, `right`, `bottom`, `left`, `z-index`
2. **Box Model**: `margin`, `padding`, `width`, `height`, `min-width`, `max-width`, `box-sizing`
3. **Tipografía**: `font`, `font-size`, `font-weight`, `line-height`, `text-align`
4. **Visual**: `color`, `background`, `border`, `border-radius`, `outline`, `box-shadow`
5. **Animación**: `transform`, `transition`, `animation`

> **Nota**: Las propiedades se ordenan estrictamente en cada archivo SCSS para mantener consistencia.

## Características

- ✅ Buscador con debounce (300ms)
- ✅ Carrito con persistencia localStorage
- ✅ Selector de color y almacenamiento dinámico
- ✅ Skeleton screens durante carga
- ✅ Mobile First responsive
- ✅ Accesibilidad WCAG (aria-live, HTML semántico)
- ✅ Precio formateado con decimales

## Limitaciones conocidas

- **Un dispositivo**: El carrito solo persiste en un navegador, no hay sincronización cloud
- **Sin checkout**: Solo añadido al carrito, no hay flujo de pago
- **Sin cuenta de usuario**: No hay autenticación
- **Sin favoritos**: No hay lista de deseos
- **Sin reviews**: No hay sistema de opiniones
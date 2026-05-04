# Zara Challenge - Tienda de Móviles

Aplicación e-commerce de telefonía móvil desarrollada con Next.js 14, TypeScript y SASS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: SASS + BEM
- **Estado**: React Context API + localStorage
- **Testing**: Jest + Playwright

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## Producción

```bash
npm run build
npm start
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Calidad

```bash
npm run lint       # ESLint
npm run lint:style # Stylelint
npm run format    # Prettier
```

## Arquitectura

```
src/
├── app/              # Páginas (App Router)
│   ├── page.tsx      # Home (listado)
│   ├── cart/        # Carrito
│   └── product/[id]/ # Detalle producto
├── components/        # Componentes UI
│   ├── Button/
│   ├── Card/
│   ├── Navbar/
│   └── skeletons/
├── hooks/            # Hooks personalizados
├── services/        # API client
├── store/           # Context API (carrito)
├── styles/          # SCSS global y tokens
├── types/           # Interfaces TypeScript
└── utils/           # Utilidades
```

## CSS Properties Order

El proyecto usa el orden de propiedades CSS definido en `css-properties-order.json`:

1. Layout (grid, flex, position)
2. Box model (margin, padding, width, height)
3. Typography
4. Visual (color, background, border)
5. Animation (transform, transition, animation)

**Nota**: Las propiedades se ordenan estrictamente en cada archivo SCSS siguiendo este orden para mantener consistencia.

## API

- Base URL: https://prueba-tecnica-api-tienda-moviles.onrender.com
- Endpoints:
  - `GET /api/products` - Listado (soporta `?search=`)
  - `GET /api/products/{id}` - Detalle
- Header requerido: `x-api-key: 87909682e6cd74208f41a6ef39fe4191`

## Características

- Buscador con debounce (300ms)
- Carrito con persistencia localStorage
- Selector de color/almacenamiento dinámico
- Skeleton screens durante carga
- Mobile First
- Accesibilidad (ARIA, semántico HTML)
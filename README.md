# Stilo & Moda — Entrega final con Vue 3

SPA de tienda de ropa juvenil migrada desde la versión HTML/CSS/JavaScript del Avance 2.

## 🌐 Aplicación en producción
**URL:** https://vgonzalezh.github.io/Proyecto_SyM/  

**Repositorio:** https://github.com/vgonzalezh/Proyecto_SyM

## Tecnologías
- Vue 3 con Composition API (`ref`, `reactive`, `computed`, `watch`, `onMounted`).
- Vite para desarrollo y compilación optimizada.
- Vue Router con navegación SPA mediante hash, compatible con GitHub Pages.
- Fetch + async/await para leer `public/data.json` y enviar el formulario a JSONPlaceholder.
- `localStorage` para carrito, borradores, mensajes, pedidos y último producto visitado. El carrito y los pedidos se guardan automáticamente en el navegador, sin crear cuentas.

## Instalación y ejecución
Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

## Compilar para producción

```bash
npm run build
npm run preview

La carpeta generada es `dist/`.

## Despliegue en GitHub Pages
El proyecto usa `base: '/Proyecto_SyM/'` en `vite.config.js` y `createWebHashHistory`, por lo que puede publicarse desde la carpeta `dist` mediante GitHub Actions. Configura Pages para desplegar el artefacto `dist`.

## Estructura

```text
src/
  components/NavBar.vue          (barra de navegación: props + emit)
  components/ProductCard.vue     (tarjeta: props + emit)
  components/QuantityStepper.vue (v-model personalizado)
  router/index.js
  services/api.js
  services/storage.js
  stores/shop.js
  views/HomeView.vue
  views/AboutView.vue
  views/ShopView.vue
  views/ProductView.vue
  views/ContactView.vue
  views/CartView.vue
  App.vue
  main.js
  styles.css
public/
  data.json
  img/
```

## Ofertas de la semana
- El círculo de -31% en la página de inicio lleva al catálogo filtrado por productos que tienen precio anterior y precio rebajado.
- El porcentaje máximo se calcula a partir de los precios del catálogo; no es un descuento aplicado indiscriminadamente a todos los productos.

## Comunicación entre componentes
- **Props (padre → hijo):** `NavBar` recibe `totalUnidades`; `ProductCard` recibe `producto`.
- **Eventos (hijo → padre):** `ProductCard` emite `agregar`; `NavBar` emite `navegar`.
- **Bidireccional:** `QuantityStepper` usa `v-model` (`defineModel`).
- **Estado compartido:** `src/stores/shop.js` (`reactive`) usado por todas las vistas.

## Rutas SPA
- `#/inicio`
- `#/conocenos`
- `#/tienda`
- `#/producto/:id`
- `#/contacto`
- `#/carrito`

## Pruebas de errores HTTP
- `?simular=404`: simula que el catálogo no existe.
- `?simular=500`: simula un error del servidor para catálogo y envío del formulario.

El formulario usa JSONPlaceholder como servicio REST público de demostración. No procesa pagos reales ni registra compras en un servidor; el carrito y los pedidos se guardan localmente en el navegador.

## Avance 2 conservado
La carpeta `Avc/` es la versión JavaScript con `app.js`, `api.js`, `storage.js`, `validacion.js`, `data.json`, estilos e imágenes. La versión Vue es la implementación

## Automatización del despliegue
Se incluye `.github/workflows/deploy.yml`. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente. Al subir cambios a `main`, la acción instala dependencias, genera `dist` y publica la aplicación.

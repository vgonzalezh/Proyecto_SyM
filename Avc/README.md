# Stilo & Moda (Desarrollo Web I)

Aplicación web frontend (SPA) de una tienda de ropa juvenil. Universidad de Córdoba.

## Cómo ejecutarla
`data.json` se carga con `fetch`, así que hay que abrir el sitio desde un servidor, no con doble clic:
- **VS Code:** instala la extensión *Live Server*, clic derecho en `index.html` y *Open with Live Server*.
- **GitHub Pages:** Settings, Pages, rama `main`, carpeta `/ (root)`.

## Estructura
| Archivo | Función |
|---|---|
| `index.html` | Todas las vistas (inicio, conócenos, tienda, producto, contacto, carrito) |
| `styles.css` | Estilos (Grid, Flexbox y 3 breakpoints) |
| `data.json` | Catálogo estructurado que se consume con `fetch` |
| `api.js` | Peticiones asíncronas, códigos HTTP y manejo de errores |
| `storage.js` | Persistencia con `localStorage` (JSON) |
| `validacion.js` | Validaciones en tiempo real |
| `app.js` | Eventos, DOM dinámico y lógica de la interfaz |

## Avance 2: requerimientos
1. **DOM y eventos:** `submit`, `click`, `input` y `change` con `event.preventDefault()`. Se crean, modifican y eliminan elementos sin recargar (tarjetas, carrito, mensajes, errores).
2. **Fetch asíncrono:** `async/await` sobre `data.json` (GET) y sobre JSONPlaceholder (POST del formulario de contacto). Se manejan 200/201, 404 y 500 con `try/catch`, un *loader* mientras carga y un mensaje de error con botón *Reintentar*.
3. **localStorage:** carrito, pedidos, mensajes enviados, borrador del formulario y último producto visto persisten al recargar.
4. **Validaciones dinámicas:** borde rojo/verde, mensajes en línea, contador de caracteres y fecha mínima calculada con la fecha actual.

## Probar los errores HTTP
- `index.html?simular=404` el catálogo responde 404.
- `index.html?simular=500` el catálogo y el envío del formulario responden 500.

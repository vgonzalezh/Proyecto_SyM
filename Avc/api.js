/* Consumo de datos asíncrono: fetch + async/await, códigos HTTP y errores */
window.Stilo = window.Stilo || {};
(() => {
  class HttpError extends Error {
    constructor(status, mensaje) { super(mensaje || "HTTP " + status); this.name = "HttpError"; this.status = status; }
  }
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  // Para probar errores: index.html?simular=404  o  index.html?simular=500
  const simular = () => new URLSearchParams(location.search).get("simular");

  async function pedir(url, opciones) {
    const res = await fetch(url, opciones);
    if (!res.ok) throw new HttpError(res.status);      // 404, 500, etc.
    return res.json();                                  // 200 / 201
  }

  // GET al archivo local data.json (catálogo estructurado)
  async function getProductos() {
    await esperar(600);                                 // latencia simulada para que se vea el loader
    const sim = simular();
    if (sim === "500") throw new HttpError(500);
    const datos = await pedir(sim === "404" ? "no-existe.json" : "data.json");
    if (!datos || !Array.isArray(datos.productos)) throw new HttpError(500, "Formato de datos inválido");
    return datos.productos;
  }

  // POST a JSONPlaceholder (API REST pública): simula el envío del formulario de contacto
  async function enviarMensaje(d) {
    if (simular() === "500") { await esperar(600); throw new HttpError(500); }
    return pedir("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ title: d.motivo, body: d.msg, userId: 1 })
    });
  }

  function mensajeError(e) {
    if (e instanceof HttpError) {
      if (e.status === 404) return "No encontramos los datos solicitados (error 404).";
      if (e.status >= 500) return "El servidor tuvo un problema (error " + e.status + "). Intenta de nuevo en unos minutos.";
      return "No se pudo completar la solicitud (error " + e.status + ").";
    }
    return "No hay conexión o no se pudo leer el archivo. Revisa tu internet e intenta de nuevo.";
  }

  Stilo.api = { getProductos, enviarMensaje, mensajeError, HttpError };
})();

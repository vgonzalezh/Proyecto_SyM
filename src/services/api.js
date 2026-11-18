export class HttpError extends Error {
  constructor(status, message = `HTTP ${status}`) { super(message); this.name = 'HttpError'; this.status = status }
}
const simular = () => new URLSearchParams(location.search).get('simular')
export async function getProductos() {
  await new Promise(resolve => setTimeout(resolve, 450))
  if (simular() === '500') throw new HttpError(500)
  const response = await fetch(simular() === '404' ? '/no-existe.json' : `${import.meta.env.BASE_URL}data.json`)
  if (!response.ok) throw new HttpError(response.status)
  const data = await response.json()
  if (!Array.isArray(data.productos)) throw new HttpError(500, 'Formato de catálogo inválido')
  return data.productos
}
export async function enviarMensaje(datos) {
  if (simular() === '500') throw new HttpError(500)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method:'POST', headers:{'Content-Type':'application/json; charset=UTF-8'},
    body:JSON.stringify({title:datos.motivo, body:datos.msg, userId:1})
  })
  if (!response.ok) throw new HttpError(response.status)
  return response.json()
}
export function mensajeError(error) {
  if (error instanceof HttpError) {
    if (error.status === 404) return 'No encontramos los datos solicitados (error 404).'
    if (error.status >= 500) return `El servidor tuvo un problema (error ${error.status}). Intenta de nuevo.`
    return `No se pudo completar la solicitud (error ${error.status}).`
  }
  return 'No hay conexión o no se pudo leer el archivo. Revisa tu conexión e intenta de nuevo.'
}

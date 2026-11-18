const prefijo = 'stilo:'
export const storage = {
  get(clave, defecto) {
    try { const valor = localStorage.getItem(prefijo + clave); return valor === null ? defecto : JSON.parse(valor) }
    catch { return defecto }
  },
  set(clave, valor) {
    try { localStorage.setItem(prefijo + clave, JSON.stringify(valor)); return true }
    catch { return false }
  },
  remove(clave) { localStorage.removeItem(prefijo + clave) }
}

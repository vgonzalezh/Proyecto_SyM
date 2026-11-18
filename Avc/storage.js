/* Persistencia del lado cliente: localStorage con datos en formato JSON */
window.Stilo = window.Stilo || {};
Stilo.store = {
  get(clave, porDefecto) {
    try {
      const valor = localStorage.getItem("stilo:" + clave);
      return valor === null ? porDefecto : JSON.parse(valor);
    } catch (e) { return porDefecto; }
  },
  set(clave, valor) {
    try { localStorage.setItem("stilo:" + clave, JSON.stringify(valor)); return true; }
    catch (e) { return false; }
  },
  remove(clave) {
    try { localStorage.removeItem("stilo:" + clave); } catch (e) {}
  }
};

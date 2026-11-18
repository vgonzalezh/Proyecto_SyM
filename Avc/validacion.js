/* Validaciones dinámicas en tiempo real con retroalimentación visual */
window.Stilo = window.Stilo || {};
(() => {
  const campos = form => [...form.elements].filter(el => el.willValidate && el.name && el.type !== "hidden");
  const zona = el => (el.type === "radio" ? el.closest("fieldset") : el);

  function mensaje(el) {
    const v = el.validity;
    if (v.valid) return "";
    if (v.valueMissing) {
      if (el.type === "radio") return "Elige una opción.";
      if (el.type === "checkbox") return "Debes aceptar para continuar.";
      return "Este campo es obligatorio.";
    }
    if (v.typeMismatch) return el.type === "email" ? "Escribe un correo válido, por ejemplo nombre@correo.com." : "El formato no es válido.";
    if (v.patternMismatch) return el.title || "El formato no es válido.";
    if (v.tooShort) return "Escribe al menos " + el.minLength + " caracteres (llevas " + el.value.length + ").";
    if (v.rangeUnderflow) return el.type === "date" ? "Elige una fecha desde hoy." : "El valor mínimo es " + el.min + ".";
    if (v.rangeOverflow) return el.type === "date" ? "Esa fecha es demasiado lejana." : "El valor máximo es " + el.max + ".";
    return "Revisa este campo.";
  }

  // Crea (o reutiliza) el <p> de error en línea junto al campo
  function cajaError(el) {
    const z = zona(el), id = (z.id || el.name) + "-error";
    let p = document.getElementById(id);
    if (!p) {
      p = document.createElement("p");
      p.id = id; p.className = "field-error"; p.setAttribute("role", "alert"); p.hidden = true;
      const campo = el.closest(".field");
      if (campo) campo.append(p); else (el.closest("label") || z).after(p);
    }
    el.setAttribute("aria-describedby", id);
    return p;
  }

  function revisar(el) {
    const msg = mensaje(el), z = zona(el), p = cajaError(el);
    const conValor = el.type === "radio" || el.type === "checkbox" ? true : el.value.trim() !== "";
    z.classList.toggle("is-invalid", !!msg);
    z.classList.toggle("is-valid", !msg && conValor);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    p.textContent = msg; p.hidden = !msg;
    return !msg;
  }

  function limpiar(form) {
    form.querySelectorAll(".is-valid, .is-invalid").forEach(x => x.classList.remove("is-valid", "is-invalid"));
    form.querySelectorAll(".field-error").forEach(p => { p.textContent = ""; p.hidden = true; });
    form.querySelectorAll("[aria-invalid]").forEach(x => x.removeAttribute("aria-invalid"));
  }

  function validarTodo(form) {
    let primero = null;
    campos(form).forEach(el => { if (!revisar(el) && !primero) primero = el; });
    if (primero) primero.focus();
    return !primero;
  }

  function activar(form) {
    form.noValidate = true;                               // usamos nuestros mensajes en lugar de los del navegador
    ["input", "change"].forEach(t => form.addEventListener(t, e => { if (campos(form).includes(e.target)) revisar(e.target); }));
    form.addEventListener("focusout", e => { if (campos(form).includes(e.target) && e.target.type !== "radio") revisar(e.target); });
    form.addEventListener("reset", () => setTimeout(() => limpiar(form)));
  }

  // Contador de caracteres que se actualiza mientras se escribe
  function contador(area) {
    const c = document.createElement("small");
    c.className = "contador";
    area.closest(".field").append(c);
    const act = () => { c.textContent = area.value.length + "/" + area.maxLength; };
    area.addEventListener("input", act);
    area.form.addEventListener("reset", () => setTimeout(act));
    act();
    return act;
  }

  Stilo.val = { activar, validarTodo, limpiar, revisar, contador };
})();

/* Stilo & Moda, Avance 2: DOM y eventos, fetch asíncrono, localStorage y validaciones */
(() => {
  "use strict";
  const { api, store, val } = window.Stilo;
  const RUTA_IMG = "img/";            // si subes las fotos junto a index.html (sin carpeta), cámbialo por ""
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => "$" + n.toLocaleString("es-CO");
  const foto = f => RUTA_IMG + f;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const TALLAS = ["S", "M", "L", "XL"];
  const RANGOS = { todos: [0, 1e9], bajo: [0, 39999], medio: [40000, 80000], alto: [80001, 1e9] };
  const ORDEN = { popular: (a, b) => b.sold - a.sold, nuevos: (a, b) => b.order - a.order, asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price };

  /* ---------- Estado (se recupera de localStorage al cargar) ---------- */
  const estado = {
    productos: [],
    carrito: store.get("carrito", []),
    mensajes: store.get("mensajes", []),
    pedidos: store.get("pedidos", []),
    actual: store.get("ultimo", null)
  };
  const porId = id => estado.productos.find(p => p.id === +id);

  /* ---------- Avisos, loader y errores ---------- */
  const toastEl = document.createElement("p");
  toastEl.id = "toast"; toastEl.className = "toast"; toastEl.setAttribute("role", "status");
  document.body.append(toastEl);
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  const cargando = txt => `<div class="loader" role="status"><span class="spinner" aria-hidden="true"></span><span>${txt}</span></div>`;
  const cajaError = txt => `<div class="error-box" role="alert"><p><strong>No pudimos cargar el catálogo.</strong> ${esc(txt)}</p><button class="btn btn--sm" type="button" data-reintentar>Reintentar</button></div>`;

  /* ---------- Carrito ---------- */
  const totalPrendas = () => estado.carrito.reduce((a, i) => a + i.qty, 0);
  function actualizarInsignia() {
    const n = totalPrendas(), b = $("#cart-badge"), a = $("#cart-link");
    b.textContent = n; b.hidden = !n;
    a.setAttribute("aria-label", n ? `Ver carrito, ${n} ${n === 1 ? "prenda" : "prendas"}` : "Ver carrito, vacío");
  }
  function guardarCarrito() { store.set("carrito", estado.carrito); actualizarInsignia(); renderCarrito(); }
  function agregar(id, talla, color, cant) {
    const f = estado.carrito.find(i => i.id === id && i.size === talla && i.color === color);
    if (f) f.qty = Math.min(10, f.qty + cant); else estado.carrito.push({ id, size: talla, color, qty: Math.min(10, cant) });
    guardarCarrito();
  }
  function renderCarrito() {
    const raiz = $("#cart-root"), sub = $("#cart-sub");
    if (!raiz || !estado.productos.length) return;
    const items = estado.carrito.map((it, ix) => ({ it, ix, p: porId(it.id) })).filter(x => x.p);
    const n = totalPrendas();
    sub.textContent = n ? `${n} ${n === 1 ? "prenda seleccionada" : "prendas seleccionadas"}` : "Tu carrito está vacío";
    if (!items.length) {
      raiz.innerHTML = '<div class="cart-empty"><p>Aún no has agregado prendas.</p><a class="btn" href="#tienda">Ir a la tienda</a></div>';
      return;
    }
    const total = items.reduce((a, { it, p }) => a + p.price * it.qty, 0);
    const antes = items.reduce((a, { it, p }) => a + (p.old || p.price) * it.qty, 0);
    raiz.innerHTML = `<ul class="cart-lines">${items.map(({ it, ix, p }) => `
      <li class="cart-line"><img src="${foto(p.img)}" alt="${esc(p.name)}" width="84" height="105">
        <div class="line-info"><h2>${esc(p.name)}</h2><p>Talla ${it.size}, color ${esc(it.color)}</p><p class="price">${fmt(p.price * it.qty)}</p></div>
        <div class="ops"><div class="qty-s"><button type="button" data-act="dec" data-ix="${ix}" aria-label="Quitar una unidad"${it.qty <= 1 ? " disabled" : ""}>−</button><output>${it.qty}</output><button type="button" data-act="inc" data-ix="${ix}" aria-label="Agregar una unidad"${it.qty >= 10 ? " disabled" : ""}>+</button></div>
        <button type="button" class="rm-link" data-act="rm" data-ix="${ix}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Eliminar</button></div></li>`).join("")}</ul>
      <aside class="summary" aria-label="Resumen de compra"><h2>Resumen</h2>
        <dl><div><dt>Subtotal (${n} ${n === 1 ? "prenda" : "prendas"})</dt><dd>${fmt(antes)}</dd></div><div><dt>Descuento</dt><dd>-${fmt(antes - total)}</dd></div><div class="total"><dt>Total</dt><dd>${fmt(total)}</dd></div></dl>
        <button class="btn" type="button" data-act="checkout">Finalizar compra</button>
        <button class="btn btn--ghost" type="button" data-act="clear">Vaciar carrito</button>
        <a class="btn btn--soft" href="#tienda">Seguir comprando</a></aside>`;
  }
  function finalizarCompra() {
    const items = estado.carrito.map(it => ({ it, p: porId(it.id) })).filter(x => x.p);
    if (!items.length) return toast("Tu carrito está vacío");
    const total = items.reduce((a, { it, p }) => a + p.price * it.qty, 0);
    const pedido = { id: "P" + String(Date.now()).slice(-6), fecha: new Date().toISOString(), total, items: estado.carrito.map(i => ({ ...i })) };
    estado.pedidos.push(pedido); store.set("pedidos", estado.pedidos);
    estado.carrito = []; store.set("carrito", []); actualizarInsignia();
    $("#cart-sub").textContent = "Gracias por tu compra";
    $("#cart-root").innerHTML = `<div class="cart-empty confirm"><h2>¡Pedido registrado!</h2><p>Tu pedido <strong>${pedido.id}</strong> por ${fmt(total)} quedó guardado en este navegador.</p><a class="btn" href="#tienda">Seguir comprando</a></div>`;
  }

  /* ---------- Tarjetas, inicio y tienda ---------- */
  function tarjeta(p) {
    const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    return `<article class="card product" data-cat="${p.cat}"><a class="ph" href="#producto" data-ver="${p.id}"><img src="${foto(p.img)}" alt="${esc(p.name)}" width="400" height="500" loading="lazy"${p.fit ? ` data-fit="${p.fit}"` : ""}>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${off ? `<span class="off">-${off}%</span>` : ""}</a>
      <div class="card-body"><h3><a href="#producto" data-ver="${p.id}">${esc(p.name)}</a></h3>
      <p class="price">${fmt(p.price)}${p.old ? ` <s>${fmt(p.old)}</s>` : ""}</p><p class="sold">${p.sold.toLocaleString("es-CO")} vendidos</p>
      <div class="row"><a class="btn btn--sm" href="#producto" data-ver="${p.id}">Ver producto</a>
      <a class="icon-btn" href="#carrito" data-rapido="${p.id}" aria-label="Agregar ${esc(p.name)} al carrito"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i></a></div></div></article>`;
  }
  const pintar = (sel, lista) => { const el = $(sel); if (el) el.innerHTML = lista.map(tarjeta).join(""); };

  function renderInicio() {
    const mas = [...estado.productos].sort(ORDEN.popular).slice(0, 4);
    pintar("#best", mas);
    pintar("#news", estado.productos.filter(p => !mas.includes(p)).sort(ORDEN.nuevos).slice(0, 4));
  }
  function renderTienda() {
    const g = $("#grid"); if (!g || !estado.productos.length) return;
    const cat = ($("input[name=cat]:checked") || { value: "todo" }).value;
    const q = norm($("#q").value.trim()), [lo, hi] = RANGOS[$("#precio").value];
    const lista = estado.productos.filter(p => (cat === "todo" || p.cat === cat) && p.price >= lo && p.price <= hi && norm(p.name).includes(q)).sort(ORDEN[$("#orden").value]);
    g.innerHTML = lista.length ? lista.map(tarjeta).join("") : '<p class="empty-msg">No encontramos prendas con esos filtros. Prueba con otra categoría o precio.</p>';
    $("#count").textContent = lista.length + (lista.length === 1 ? " prenda encontrada" : " prendas encontradas");
  }

  /* ---------- Detalle de producto ---------- */
  function renderDetalle() {
    if (!$("#detail") || !estado.productos.length) return;
    const p = porId(estado.actual) || estado.productos[0];
    const imgs = p.imgs || [p.img], off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    $("#p-name").textContent = p.name; $("#crumb").textContent = p.name;
    $("#p-price").innerHTML = fmt(p.price) + (p.old ? ` <s>${fmt(p.old)}</s> <span class="off off--inline">-${off}%</span>` : "");
    $("#p-desc").textContent = p.desc;
    $("#p-sold").textContent = p.sold.toLocaleString("es-CO") + " personas ya la compraron";
    const b = $("#p-badge"); b.textContent = p.badge; b.hidden = !p.badge;
    const im = $("#p-img"); im.src = foto(imgs[0]); im.alt = p.name; im.dataset.fit = p.fit || "";
    $("#thumbs").innerHTML = imgs.length > 1 ? imgs.map((f, i) => `<button type="button" class="${i ? "" : "on"}" data-foto="${f}" aria-label="Ver foto ${i + 1}"><img src="${foto(f)}" alt="" width="64" height="64"></button>`).join("") : "";
    $("#p-sizes").innerHTML = TALLAS.map(s => `<input type="radio" name="talla" id="t${s}" value="${s}" required><label for="t${s}">${s}</label>`).join("");
    $("#p-colors").innerHTML = p.colors.map((c, i) => `<input type="radio" name="color" id="c${i}" value="${esc(c[0])}"${i ? "" : " checked"}><label for="c${i}" class="sw" style="--c:${c[1]}"><span class="sr-only">${esc(c[0])}</span></label>`).join("");
    $("#cantidad").value = 1; val.limpiar($("#buy"));
    pintar("#related", estado.productos.filter(x => x.id !== p.id && x.cat === p.cat).concat(estado.productos.filter(x => x.id !== p.id && x.cat !== p.cat)).slice(0, 4));
  }

  /* ---------- Carga asíncrona del catálogo (fetch + loader + errores) ---------- */
  const ZONAS = ["#best", "#news", "#grid", "#related"];
  function aviso(txt) {
    let b = $(".banner");
    if (!txt) return b && b.remove();
    if (!b) { b = document.createElement("p"); b.className = "banner"; $("main").before(b); }
    b.textContent = txt;
  }
  async function cargarCatalogo() {
    const zonas = ZONAS.map(s => $(s)).filter(Boolean);
    zonas.forEach(z => { if (z._base === undefined) z._base = z.innerHTML; z.innerHTML = cargando("Cargando catálogo…"); z.setAttribute("aria-busy", "true"); });
    try {
      estado.productos = await api.getProductos();
      zonas.forEach(z => z.removeAttribute("aria-busy"));
      aviso(null);
      renderInicio(); renderTienda(); renderDetalle(); renderCarrito();
    } catch (err) {
      console.error(err);
      zonas.forEach(z => z.removeAttribute("aria-busy"));
      if (err instanceof TypeError && location.protocol === "file:") {
        zonas.forEach(z => { z.innerHTML = z._base; });
        aviso("Abriste el archivo directamente (file://). Para cargar data.json usa Live Server o GitHub Pages.");
      } else {
        zonas.forEach(z => { z.innerHTML = cajaError(api.mensajeError(err)); });
      }
    }
  }

  /* ---------- Contacto: validación, borrador, POST y mensajes guardados ---------- */
  const datosForm = f => Object.fromEntries(new FormData(f));
  const hoyISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  function estadoForm(tipo, txt) { const e = $("#form-status"); e.className = "form-status" + (tipo ? " form-status--" + tipo : ""); e.textContent = txt; }

  function renderMensajes() {
    const ul = $("#msg-list"); if (!ul) return;
    ul.innerHTML = estado.mensajes.length ? estado.mensajes.map(m => `<li class="msg-item" data-id="${m.id}"><div><strong>${esc(m.motivo)}</strong><small>${esc(m.nombre)}, ${new Date(m.fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</small><p>${esc(m.msg)}</p></div><button class="btn btn--ghost btn--sm" type="button" data-borrar="${m.id}">Eliminar</button></li>`).join("")
      : '<li class="msg-empty">Aún no has enviado mensajes.</li>';
    $("#msg-clear").disabled = !estado.mensajes.length;
  }

  function iniciarContacto() {
    const f = $("#contact"); if (!f) return;
    val.activar(f);
    const actContador = val.contador($("#msg"));
    $("#fecha").min = hoyISO();                                   // validación dinámica: no se aceptan fechas pasadas
    const borrador = store.get("borrador", {});                   // recupera lo que se había escrito antes de recargar
    Object.entries(borrador).forEach(([k, v]) => { const el = f.elements[k]; if (el) { if (el.type === "checkbox") el.checked = !!v; else el.value = v; } });
    actContador();
    f.addEventListener("input", () => store.set("borrador", datosForm(f)));
    f.addEventListener("change", () => store.set("borrador", datosForm(f)));
    f.addEventListener("submit", async e => {
      e.preventDefault();
      if (!val.validarTodo(f)) return estadoForm("error", "Revisa los campos marcados en rojo.");
      const d = datosForm(f), btn = $("button[type=submit]", f), texto = btn.textContent;
      btn.disabled = true; btn.classList.add("is-loading");
      btn.innerHTML = '<span class="spinner spinner--sm" aria-hidden="true"></span> Enviando…';
      estadoForm("info", "Enviando tu mensaje…");
      try {
        const r = await api.enviarMensaje(d);
        estado.mensajes.unshift({ id: Date.now(), nombre: d.nombre, email: d.email, motivo: d.motivo, msg: d.msg, fecha: new Date().toISOString() });
        store.set("mensajes", estado.mensajes); store.remove("borrador");
        f.reset(); renderMensajes();
        estadoForm("ok", `¡Mensaje enviado! Código de confirmación ${r.id}.`);
        toast("Mensaje enviado y guardado");
      } catch (err) {
        console.error(err);
        estadoForm("error", api.mensajeError(err) + " Tus datos siguen guardados para que lo intentes otra vez.");
      } finally {
        btn.disabled = false; btn.classList.remove("is-loading"); btn.textContent = texto;
      }
    });
    renderMensajes();
  }

  /* ---------- Eventos globales ---------- */
  function iniciarEventos() {
    document.addEventListener("click", e => {
      const ver = e.target.closest("[data-ver]");
      if (ver) {
        estado.actual = +ver.dataset.ver; store.set("ultimo", estado.actual); renderDetalle();
        if (location.hash === "#producto") window.scrollTo({ top: 0 });
        return;                                                    // el enlace #producto muestra la vista
      }
      const rapido = e.target.closest("[data-rapido]");
      if (rapido) {
        e.preventDefault();
        const p = porId(rapido.dataset.rapido); if (!p) return;
        agregar(p.id, "M", p.colors[0][0], 1); toast(`${p.name} agregado al carrito (talla M)`); return;
      }
      const tile = e.target.closest("a.tile[data-cat]");
      if (tile) { const r = $("#f-" + tile.dataset.cat); if (r) { r.checked = true; renderTienda(); } return; }
      if (e.target.closest("[data-reintentar]")) cargarCatalogo();
    });

    const filtros = $("#filters");
    if (filtros) {
      filtros.addEventListener("input", renderTienda); filtros.addEventListener("change", renderTienda);
      filtros.addEventListener("submit", e => e.preventDefault());
      filtros.addEventListener("reset", () => setTimeout(renderTienda));
    }
    const miniaturas = $("#thumbs");
    if (miniaturas) miniaturas.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      $("#p-img").src = foto(b.dataset.foto); $$("#thumbs button").forEach(x => x.classList.toggle("on", x === b));
    });
    const comprar = $("#buy");
    if (comprar) {
      val.activar(comprar);
      comprar.addEventListener("submit", e => {
        e.preventDefault();
        if (!val.validarTodo(comprar)) return;
        const fd = new FormData(comprar), p = porId(estado.actual) || estado.productos[0]; if (!p) return;
        agregar(p.id, fd.get("talla"), fd.get("color"), +fd.get("cantidad"));
        toast(`Agregaste ${p.name} al carrito`);
        comprar.reset(); renderDetalle();
      });
    }
    const raiz = $("#cart-root");
    if (raiz) raiz.addEventListener("click", e => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const it = estado.carrito[b.dataset.ix];
      if (b.dataset.act === "inc" && it) it.qty = Math.min(10, it.qty + 1);
      if (b.dataset.act === "dec" && it) it.qty = Math.max(1, it.qty - 1);
      if (b.dataset.act === "rm" && it) estado.carrito.splice(b.dataset.ix, 1);
      if (b.dataset.act === "clear") estado.carrito = [];
      if (b.dataset.act === "checkout") return finalizarCompra();
      guardarCarrito();
    });
    const lista = $("#msg-list");
    if (lista) lista.addEventListener("click", e => {
      const b = e.target.closest("[data-borrar]"); if (!b) return;
      estado.mensajes = estado.mensajes.filter(m => String(m.id) !== b.dataset.borrar);
      store.set("mensajes", estado.mensajes);
      b.closest("li").remove();                                    // elimina el elemento del DOM sin recargar
      if (!estado.mensajes.length) renderMensajes();
      $("#msg-clear").disabled = !estado.mensajes.length;
      toast("Mensaje eliminado");
    });
    const vaciar = $("#msg-clear");
    if (vaciar) vaciar.addEventListener("click", () => { estado.mensajes = []; store.set("mensajes", []); renderMensajes(); toast("Historial vaciado"); });
  }

  /* ---------- Inicio ---------- */
  actualizarInsignia();
  iniciarEventos();
  iniciarContacto();
  cargarCatalogo();
})();

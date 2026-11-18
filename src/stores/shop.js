import { reactive, computed } from 'vue'
import { storage } from '../services/storage'
import { getProductos } from '../services/api'
export const shop = reactive({
  productos:[], cargando:false, error:'',
  carrito:storage.get('carrito',[]), mensajes:storage.get('mensajes',[]), pedidos:storage.get('pedidos',[]),
  ultimo:storage.get('ultimo',1), toast:''
})
export const totalUnidades = computed(() => shop.carrito.reduce((s,item)=>s+item.qty,0))
export const totalCompra = computed(() => shop.carrito.reduce((s,item)=>s+(shop.productos.find(p=>p.id===item.id)?.price||0)*item.qty,0))
export const formato = n => '$' + Number(n||0).toLocaleString('es-CO')
export const productoPorId = id => shop.productos.find(p=>p.id===Number(id))
export async function cargarProductos() {
  shop.cargando=true; shop.error=''
  try { shop.productos=await getProductos() }
  catch(e) { const {mensajeError}=await import('../services/api'); shop.error=mensajeError(e) }
  finally { shop.cargando=false }
}
function guardarCarrito(){ storage.set('carrito',shop.carrito) }
export function agregarCarrito(id,talla,color,cantidad=1){
  const item=shop.carrito.find(i=>i.id===id&&i.size===talla&&i.color===color)
  if(item) item.qty=Math.min(10,item.qty+cantidad)
  else shop.carrito.push({id,size:talla,color,qty:Math.min(10,cantidad)})
  guardarCarrito(); notificar('Producto agregado al carrito')
}
export function cambiarCantidad(index,delta){ const item=shop.carrito[index]; if(!item)return; item.qty=Math.max(1,Math.min(10,item.qty+delta)); guardarCarrito() }
export function eliminarCarrito(index){shop.carrito.splice(index,1);guardarCarrito()}
export function vaciarCarrito(){shop.carrito=[];guardarCarrito()}
export function finalizarCompra(){
  if(!shop.carrito.length)return notificar('Tu carrito está vacío')
  const pedido={id:'P'+String(Date.now()).slice(-6),fecha:new Date().toISOString(),total:totalCompra.value,items:shop.carrito.map(i=>({...i}))}
  shop.pedidos.push(pedido);storage.set('pedidos',shop.pedidos);vaciarCarrito();notificar(`Pedido ${pedido.id} registrado`);return pedido
}
let timeout
export function notificar(texto){shop.toast=texto;clearTimeout(timeout);timeout=setTimeout(()=>shop.toast='',2600)}

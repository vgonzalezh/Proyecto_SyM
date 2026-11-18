<script setup>
import { formato } from '../stores/shop'
const base=import.meta.env.BASE_URL
const props=defineProps({producto:{type:Object,required:true}})
const emit=defineEmits(['agregar'])
const descuento=props.producto.old?Math.round((1-props.producto.price/props.producto.old)*100):0
function rapido(){emit('agregar',props.producto)}</script>
<template>
  <article class="card product" :data-cat="producto.cat">
    <RouterLink class="ph" :to="`/producto/${producto.id}`"><img :src="`${base}img/${producto.img}`" :alt="producto.name" width="400" height="500" loading="lazy" :data-fit="producto.fit||''"><span v-if="producto.badge" class="badge">{{producto.badge}}</span><span v-if="descuento" class="off">-{{descuento}}%</span></RouterLink>
    <div class="card-body"><h3><RouterLink :to="`/producto/${producto.id}`">{{producto.name}}</RouterLink></h3><p class="price">{{formato(producto.price)}} <s v-if="producto.old">{{formato(producto.old)}}</s></p><p class="sold">{{producto.sold.toLocaleString('es-CO')}} vendidos</p><div class="row"><RouterLink class="btn btn--sm" :to="`/producto/${producto.id}`">Ver producto</RouterLink><button class="icon-btn" type="button" @click="rapido" :aria-label="`Agregar ${producto.name} al carrito`"><i class="fa-solid fa-cart-plus"></i></button></div></div>
  </article>
</template>

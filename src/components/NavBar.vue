<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Recibe el total de prendas del carrito (props: datos hacia el hijo)
defineProps({ totalUnidades: { type: Number, default: 0 } })
// Avisa al padre cuando se navega (eventos personalizados: datos hacia el padre)
const emit = defineEmits(['navegar'])

const menu = ref(false)
function ir() { menu.value = false; emit('navegar') }
</script>

<template>
  <header class="site-header"><div class="bar">
    <RouterLink class="brand" to="/inicio" @click="ir">Stilo &amp; Moda</RouterLink>
    <input id="menu-toggle" v-model="menu" type="checkbox" class="menu-toggle" aria-label="Abrir o cerrar el menú"><label for="menu-toggle" class="burger"><i class="fa-solid fa-bars"></i></label>
    <nav aria-label="Principal"><ul>
      <li><RouterLink to="/inicio" @click="ir">Inicio</RouterLink></li>
      <li><RouterLink to="/conocenos" @click="ir">Conócenos</RouterLink></li>
      <li><RouterLink to="/tienda" @click="ir">Tienda</RouterLink></li>
      <li><RouterLink to="/producto" @click="ir">Producto</RouterLink></li>
      <li><RouterLink to="/contacto" @click="ir">Contactos</RouterLink></li>
    </ul></nav>
    <RouterLink id="cart-link" class="cart" to="/carrito" :aria-label="`Ver carrito, ${totalUnidades} prendas`" @click="ir"><i class="fa-solid fa-bag-shopping"></i><span class="cart-badge" v-show="totalUnidades">{{ totalUnidades }}</span></RouterLink>
  </div></header>
</template>

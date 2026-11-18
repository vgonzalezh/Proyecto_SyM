<script setup>
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { shop, totalUnidades, cargarProductos } from './stores/shop'
const route=useRoute()
onMounted(cargarProductos)
</script>
<template>
  <p class="announce">Ofertas de la semana: hasta -31% en prendas seleccionadas</p>
  <NavBar :total-unidades="totalUnidades" />
  <main id="app-main">
    <div v-if="shop.error" class="error-box global-error" role="alert"><p><strong>No pudimos cargar el catálogo.</strong> {{shop.error}}</p><button class="btn btn--sm" @click="cargarProductos">Reintentar</button></div>
    <div v-else-if="shop.cargando" class="loader"><span class="spinner"></span><span>Cargando catálogo…</span></div>
    <RouterView v-else :key="route.fullPath" />
  </main>
  <footer class="site-footer"><p class="brand">Stilo &amp; Moda</p><p class="tag">Encuentra todos los estilos que buscas y más</p><ul class="social"><li><a href="https://instagram.com" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></li><li><a href="https://wa.me/573000000000" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a></li><li><a href="https://facebook.com" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a></li></ul><p class="legal">© 2026 Stilo &amp; Moda. Proyecto de Desarrollo Web.</p></footer>
  <Transition><p v-if="shop.toast" class="toast show" role="status">{{shop.toast}}</p></Transition>
</template>

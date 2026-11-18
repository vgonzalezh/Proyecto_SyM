import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ShopView from '../views/ShopView.vue'
import ProductView from '../views/ProductView.vue'
import ContactView from '../views/ContactView.vue'
import CartView from '../views/CartView.vue'
export default createRouter({
  history:createWebHashHistory(import.meta.env.BASE_URL),
  routes:[
    {path:'/',redirect:'/inicio'},
    {path:'/inicio',component:HomeView},
    {path:'/conocenos',component:AboutView},
    {path:'/tienda',component:ShopView},
    {path:'/producto/:id?',component:ProductView},
    {path:'/contacto',component:ContactView},
    {path:'/carrito',component:CartView},
    {path:'/:pathMatch(.*)*',redirect:'/inicio'}
  ], scrollBehavior(){return {top:0}}
})

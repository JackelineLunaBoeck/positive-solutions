import Vue from 'vue'
import VueRouter from 'vue-router';

import Usuarios from "@/components/Usuarios.vue";
import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import Productos from "@/components/Productos.vue";
import Categorias from "@/components/Categorias.vue";
import Proveedores from "@/components/Proveedores.vue";
import Clientes from "@/components/Clientes.vue";
import Ventas from "@/components/Ventas.vue";
import Compras from "@/components/Compras.vue";
import PagoProveedores from "@/components/PagoProveedores.vue";
import Roles from "@/components/Roles.vue";


//import store from '@/store'
import { auth } from "@/components/firebase";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/login',  name: 'Login', component: Login },
    { path: '/',  name: 'Dashboard', component: Dashboard,
    meta: {requiresAuth: true},
    children: [
      { path: 'usuarios', component: Usuarios, meta: {requiresAuth: true}},
      { path: 'productos', component: Productos, meta: {requiresAuth: true}},
      { path: 'categorias', component: Categorias, meta: {requiresAuth: true}},
      { path: 'proveedores', component: Proveedores, meta: {requiresAuth: true}},
      { path: 'clientes', component: Clientes, meta: {requiresAuth: true}},
      { path: 'ventas', component: Ventas, meta: {requiresAuth: true}},
      { path: 'compras', component: Compras, meta: {requiresAuth: true}},
      { path: 'roles', component: Roles, meta: {requiresAuth: true}},
      { path: 'pago-proveedores', component: PagoProveedores, meta: {requiresAuth: true}},
    ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth){
    if(!user){
      
      next({ name: 'Login' })
      return
    }
    else{
      next()
    }
  }
  else {
    next()
  }
})

export default router;
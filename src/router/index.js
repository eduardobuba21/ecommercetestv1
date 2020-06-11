import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Checkout from '@/views/Checkout.vue'

import DashAdmin from '@/views/DashAdmin.vue'
import Overview from '@/views/dashadmin/Overview.vue'
import Orders from '@/views/dashadmin/Orders.vue'
import Products from '@/views/dashadmin/Products.vue'
import Clients from '@/views/dashadmin/Clients.vue'
import Discounts from '@/views/dashadmin/Discounts.vue'
import Help from '@/views/dashadmin/Help.vue'
import Settings from '@/views/dashadmin/Settings.vue'

const firebase = require("../firebaseConfig.js");

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashadmin',
    name: 'DashAdmin',
    component: DashAdmin,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Clients,
      },
      {
        path: 'discounts',
        name: 'Discounts',
        component: Discounts,
      },
      {
        path: 'help',
        name: 'Help',
        component: Help,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router

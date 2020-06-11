import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Checkout from '@/views/Checkout.vue'

import Admin from '@/views/Admin.vue'
import Overview from '@/views/admin/Overview.vue'
import Orders from '@/views/admin/Orders.vue'
import Options from '@/views/admin/Options.vue'
import Products from '@/views/admin/Products.vue'
import Profile from '@/views/admin/Profile.vue'
import DashClient from '@/views/client/DashClient'

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
    path: '/dash-client',
    name: 'DashClient',
    component: DashClient
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
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
        path: 'options',
        name: 'Options',
        component: Options,
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
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

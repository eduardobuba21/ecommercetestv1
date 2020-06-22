import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Checkout from '@/views/Checkout.vue'

import Unauthorized from '@/views/Unauthorized.vue'

// ======================================================================================================== //
// DashAdmin
import DashAdmin from '@/views/DashAdmin.vue'
import Overview from '@/views/dashadmin/Overview.vue'
import Orders from '@/views/dashadmin/Orders.vue'
import Products from '@/views/dashadmin/Products.vue'
import Clients from '@/views/dashadmin/Clients.vue'
import Discounts from '@/views/dashadmin/Discounts.vue'
import Help from '@/views/dashadmin/Help.vue'
import Settings from '@/views/dashadmin/Settings.vue'

import Administrators from '@/views/dashadmin/Administrators.vue'

// ======================================================================================================== //
// DashClient
import DashClient from '@/views/DashClient'
import YourOrders from '@/views/dashclient/YourOrders'
import PaymentData from '@/views/dashclient/PaymentData'
import Personal from '@/views/dashclient/Personal'
import Address from '@/views/dashclient/Address'

import ChangeName from '@/views/dashclient/change-data/ChangeName'
import ChangeEmail from '@/views/dashclient/change-data/ChangeEmail'
import ChangePassword from '@/views/dashclient/change-data/ChangePassword'
import ChangePhone from '@/views/dashclient/change-data/ChangePhone'

const firebase = require("../firebaseConfig.js");

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
},
{
  path: '/checkout',
  name: 'Checkout',
  component: Checkout,
},
{
  path: '/login',
  name: 'Login',
  component: Login,
  meta: {
    loginRedirect: true
  },
},
{
  path: '/unauthorized',
  name: 'Unauthorized',
  component: Unauthorized,
},
// ======================================================================================================== //
// DashClient //
{
  path: '/dashclient',
  name: 'DashClient',
  component: DashClient,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'yourorders',
      name: 'YourOrders',
      component: YourOrders,
    },
    {
      path: 'paymentdata',
      name: 'PaymentData',
      component: PaymentData,
    },
    {
      path: 'personal',
      name: 'Personal',
      component: Personal,
      children: [
        {
          path: 'changename',
          name: 'ChangeName',
          component: ChangeName,
        },
        {
          path: 'changeemail',
          name: 'ChangeEmail',
          component: ChangeEmail,
        },
        {
          path: 'changePassword',
          name: 'ChangePassword',
          component: ChangePassword,
        },
        {
          path: 'changephone',
          name: 'ChangePhone',
          component: ChangePhone,
        }
      ]
    },
    {
      path: 'address',
      name: 'Address',
      component: Address,
    }
  ]
},

// ======================================================================================================== //
// DashAdmin //
{
  path: '/dashadmin',
  name: 'DashAdmin',
  component: DashAdmin,
  meta: {
    requiresAuth: true,
    requiresAdmin: true
  },
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
    },
    {
      path: 'administrators',
      name: 'Administrators',
      component: Administrators,
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

  // For the login route
  if (to.matched.some(x => x.meta.loginRedirect)) {
    if (!currentUser) {
      next()
    } else {
      firebase.auth.currentUser.getIdTokenResult()
        .then(function ({ claims }) {
          if (claims.role == "admin") {
            next('/dashadmin/overview')
          } else {
            next('/dashclient')
          }
        })
    }
  }

  // For any other routes
  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    // If route requires Admin
    if (to.matched.some(x => x.meta.requiresAdmin)) {
      firebase.auth.currentUser.getIdTokenResult()
        .then(function ({ claims }) {
          if (claims.role == "admin") {
            next()
          } else {
            next('/unauthorized')
          }
        })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
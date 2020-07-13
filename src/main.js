import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/styles/ecommerce.css'

// ======================================================================== //
// Firebase //
const firebase = require('@/firebaseConfig.js')
import VueFirestore from 'vue-firestore'
Vue.use(VueFirestore, {
  key: 'id',
  enumerable: true
})

// ======================================================================== //
// Input Masks //
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)
import money from 'v-money'
Vue.use(money, { precision: 2, masked: false, decimal: ',', thousands: '.', })

// ======================================================================== //
// ViaCep //

import ViaCep from 'vue-viacep'

Vue.use(ViaCep)

// ======================================================================== //
// Buy Button //
Vue.component('Buy', require('@/components/Buy.vue').default)


Vue.config.productionTip = false

let app
firebase.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
firebase.auth.onAuthStateChanged(user => {
  if (user) {
    firebase.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data())
    })

    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
  }
})

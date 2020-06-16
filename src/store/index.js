import Vue from 'vue'
import Vuex from 'vuex'

const firebase = require('@/firebaseConfig.js')

Vue.use(Vuex)

let cart = window.localStorage.getItem('cart')

export default new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},

    cart: cart ? JSON.parse(cart) : []
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setUserProfile(state, val) {
      state.userProfile = val
    },

    saveData(state) {
      window.localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    addToCart(state, item) {
      let productitem = {
        productId: null,
        quantity: null
      };
      productitem.productId = item;
      productitem.quantity = 1;
      state.cart.push(productitem);
      this.commit('saveData')
    },
    removeFromCart(state, product) {
      let index = state.cart.indexOf(product);
      state.cart.splice(index, 1);
      this.commit('saveData')
    }
  },
  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
    },
    fetchUserProfile({ commit, state }) {
      firebase.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    },
    updateProfile({ state }, data) {
      let name = data.name
      let title = data.title
      let email = data.email

      firebase.usersCollection.doc(state.currentUser.uid).update({ name, title, email })
    }
  },
  modules: {
  }
})

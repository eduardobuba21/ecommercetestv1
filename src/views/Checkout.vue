<template>
  <div class="checkout">
    <Navbar />

    <h1>Checkout page</h1>
    <div class="checkoutcontainer">
      <div class="checkoutleft">
        <div class="p-cards">
          <div class="card" v-for="product in this.cartproducts" :key="product.id">
            <img class="card-img" :src="product.image" />
            <h3 class="card-title">{{ product.name }}</h3>
            <h3 class="card-price">R$ {{ product.price }}</h3>
            <buy :productId="product.id"></buy>
            <span @click="removeFromCheckout(product)">X</span>
          </div>
        </div>
      </div>

      <div class="checkoutright">
        <button @click="pay()">Pay</button>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require("../firebaseConfig.js");
import Navbar from "@/components/Navbar.vue";

let stripe = window.Stripe("pk_test_Q2zL4p2Yy3hNTFZZd3hCQ5by00L2jr9wDs");
import axios from "axios";

export default {
  name: "Checkout",
  components: {
    Navbar
  },
  data() {
    return {
      products: [],
      cartproducts: [],
      sessionId: ""
    };
  },
  firestore() {
    return {
      products: firebase.productsCollection
    };
  },
  methods: {
    pay() {
      let cartdata = this.$store.state.cart.map(item => ({
        [item.productId]: item.quantity
      }));

      cartdata = Object.assign({}, ...cartdata);

      axios
        .get(
          "https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutSession",
          {
            params: {
              products: cartdata
            }
          }
        )
        .then(response => {
          this.sessionId = response.data;
          console.log(response.data);

          stripe
            .redirectToCheckout({
              sessionId: this.sessionId.id
            })
            .then(function(result) {
              console.log("Stripe result error: ", result.error.message);
            });
        })
        .catch(err => {
          console.log("Retrieve session error: ", err);
        });
    },
    removeFromCheckout(item) {
      this.$store.commit("removeFromCart", item);

      let index = this.cartproducts.indexOf(item);
      this.cartproducts.splice(index, 1);
    }
  },
  created() {
    this.$store.state.cart.forEach(item => {
      var docRef = firebase.productsCollection.doc(item.productId);
      docRef.get().then(doc => {
        let productinfo = doc.data();
        productinfo.quantity = 1;
        productinfo.productId = item.productId;
        this.cartproducts.push(productinfo);
      });
    });
  }
};
</script>

<style>
.checkoutcontainer {
  display: grid;
  grid:
    "checkoutleft checkoutright" 40vh
    "checkoutleft checkoutright" 40vh
    / 50% 50%;
}

.checkoutleft {
  grid-area: checkoutleft;
}

.checkoutright {
  grid-area: checkoutright;
}
</style>
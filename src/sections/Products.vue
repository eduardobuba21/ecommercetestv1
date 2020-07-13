<template>
  <div class="products">
    <div class="p-tittle">
      <h1>Nossos Produtos</h1>
    </div>

    <div class="p-cards">
      <div class="card" v-for="product in products" :key="product.id">
        <img class="card-img" :src="product.image" />
        <h3 class="card-title">{{ product.name }}</h3>
        <h3
          class="card-price"
        >R$ {{ product.price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</h3>
        <buy :productId="product.id"></buy>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require("../firebaseConfig.js");

export default {
  name: "Products",
  data() {
    return {
      products: []
    };
  },
  firestore() {
    return {
      products: firebase.productsCollection
    };
  }
};
</script>

<style>
.products {
  display: grid;
  grid:
    "productstittle" 150px
    "products" 400px
    / 100%;
}

.p-tittle {
  grid-area: productstittle;
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-cards {
  grid-area: products;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  margin: 50px;
}

.card-img {
  width: 250px;
  border-radius: 3%;
}

.card-price {
  margin: 5px 0 20px 0;
}
</style>

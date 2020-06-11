<template>
  <div class="buy">
    <button class="btn-primary" @click="addToCart()">Comprar</button>
  </div>
</template>

<script>
export default {
  name: "Buy",
  props: {
    productId: String
  },
  methods: {
    addToCart() {
      this.$store.commit("addToCart", this.productId);
    }
  }
};
</script>

<style>
</style>
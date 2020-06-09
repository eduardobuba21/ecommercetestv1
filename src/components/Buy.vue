<template>
  <div class="buy">
    <button class="card-btn" @click="addToCart()">Comprar</button>
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
.card-btn {
  padding: 10px;
  border: 2px solid #f6a821;
  border-radius: 10px;
}
</style>
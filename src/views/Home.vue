<template>
  <div class="home">
    <Navbar />
    <Products />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Products from "@/sections/Products.vue";

export default {
  name: "Home",
  components: {
    Navbar,
    Products
  }
};
</script>

<style>
</style>
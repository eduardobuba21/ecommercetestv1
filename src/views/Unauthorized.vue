<template>
  <div class="unauthorized">
    <Navbar />
    <div class="unauthorized-center">
      <svg>
        <use xlink:href="@/assets/icons.svg#locker" />
      </svg>
      <h1>Acesso não autorizado!</h1>
      <p>Você tentou acessar uma página que exige privilégios.</p>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "Unauthorized",
  components: {
    Navbar
  }
};
</script>

<style>
.unauthorized-center {
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.unauthorized-center svg {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
}

.unauthorized-center h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.unauthorized-center p {
  font-size: 1.8rem;
}
</style>
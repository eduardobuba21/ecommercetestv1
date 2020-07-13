<template>
  <div class="wrap-address">
    <div class="address">
      <div class="title">
        <h3>Endereço</h3>
      </div>
      <div class="street">
        <p>{{userProfile.address}}</p>
        <p>, {{userProfile.addressnumber}}</p>
      </div>
      <div class="type">
        <p>{{userProfile.addresscomplement}}</p>
      </div>
      <div class="city-state-cep">
        <p>{{userProfile.addresscity}}</p>
        <p>, {{userProfile.addressstate}}</p>
        <p>, {{userProfile.addresspostcode}}</p>
      </div>
      <div class="phone">
        <p>{{userProfile.addressphone}}</p>
      </div>
      <div class="options">
        <router-link to="/dashclient/changeaddress">
          <button class="btn-alter">Editar</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Address",
  computed: {
    ...mapGetters(["userProfile"])
  }
};
</script>

<style>
.wrap-address {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .address {
  background-color: #1b2124;
  color: whitesmoke;
  width: 400px;
  height: 300px;
  border-radius: 20px;
  padding: 30px;
  margin: 30px;
  display: grid;
  grid-template-rows: 10% 20% 15% 15% 15% 25%;
  grid-template-areas:
    "title"
    "street"
    "type"
    "csp"
    "phone"
    "options";
}

.wrap-address .address .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .address .street {
  grid-area: street;
  border-top: 1px solid whitesmoke;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.wrap-address .address .type {
  grid-area: type;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-address .address .city-state-cep {
  grid-area: csp;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-address .address .phone {
  grid-area: phone;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-address .address .options {
  grid-area: options;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .address .options button {
  margin: 5px;
}
</style>
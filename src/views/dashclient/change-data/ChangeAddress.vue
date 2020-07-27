<template>
  <div class="wrap-change-address">
    <div class="change-address-form">
      <div class="title">
        <h2>Mudar Endereço</h2>
      </div>
      <div class="form">
        <label for="postcode">
          <h3>CEP:</h3>
          <input name="cep" type="text" id="cep" value="" size="10" maxlength="9" v-model="user.addresspostcode"
                    @blur="search_postcode(user.addresspostcode);" />
        </label>
        <label for="state">
          <h3>Estado:</h3>
          <input name="uf" type="text" id="uf" v-model="user.addressstate" value="userProfile.adressstate" size="2" />
        </label>
        <label for="city">
          <h3>Cidade:</h3>
          <input name="cidade" type="text" id="cidade" size="40" v-model="user.addresscity" />
        </label>
        <label for="neighborhood">
          <h3>Bairro:</h3>
          <input name="bairro" type="text" id="bairro" size="40" v-model="user.addressneighborhood"/>
        </label>
        <label for="street">
          <h3>Rua:</h3>
          <input name="rua" type="text" id="rua" size="60" v-model="user.address"/>
        </label>
        <label for="number">
          <h3>Número:</h3>
          <input name="rua" type="text" id="rua" size="5" v-model="user.addressnumber"/>
        </label>
        <label for="complement">
          <h3>Complemento:</h3>
          <input name="rua" type="text" id="rua" size="60" v-model="user.addresscomplement"/>
        </label>
        <label for="recipient">
          <h3>Recebedor:</h3>
          <input name="rua" type="text" id="rua" size="60" v-model="user.addressrecipient"/>
        </label>
        <label for="phone">
          <h3>Telefone do Recebedor:</h3>
          <input name="rua" type="text" id="rua" size="60" v-model="user.addressphone"/>
        </label>
      </div>
      <div class="actions">
        <button class="btn-save">Salvar</button>
        <button class="btn-remove">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require('@/firebaseConfig.js')
import {mapGetters} from 'vuex'

export default {
  name: "ChangeAddress",
  data() {
    return {
      users: [],
      user: {
        addresspostcode: "",
        addressstate: "",
        addresscity: "",
        addressneighborhood: "",
        address: "",
        addressnumber: "",
        addresscomplement: "",
        addressrecipient: "",
        addressphone: "",
      }
    }
  },
  firestore() {
    return {
      users: firebase.usersCollection
    };
  },
  methods: {
    search_postcode(value){
      this.$viaCep.buscarCep(value).then((obj) => {
        this.user.addresscity = obj.localidade
        this.user.addressstate = obj.uf
      })
    },

    userProfile(){
      return mapGetters.userProfile
    }
  }
};
</script>

<style>
.wrap-change-address {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change-address .change-address-form {
  width: 700px;
  height: 1200px;
  border-radius: 20px;
  padding: 50px;
  color: whitesmoke;
  background-color: #1b2124;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  grid-template-areas:
    "title"
    "form"
    "actions";
}

.wrap-change-address .change-address-form .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change-address .change-address-form .form {
  grid-area: form;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}

.wrap-change-address .change-address-form .actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change-address .change-address-form .actions button {
  margin: 5px;
}
</style>
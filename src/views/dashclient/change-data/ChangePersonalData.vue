<template>
  <div class="change">
    <div class="title">
      <h2>Altere seus dados pessoais:</h2>
    </div>
    <div class="description">
      <h4>
        Se quiser alterar seus dados pessoais associados à sua conta da South Pine, você poderá fazê-lo a seguir.
        Lembre-se de clicar no botão
        <span>Salvar Alterações</span> quando tiver concluído.
      </h4>
    </div>
    <div class="change-name">
      <h3>Nome:</h3>
      <input type="text" v-model="user.name" />
    </div>
    <div class="change-phone">
      <h3>Telefone:</h3>
      <the-mask :mask="['(##) #####-####']" :masked="true" v-model="user.phone" />
    </div>
    <div class="change-password">
      <h4>
        Para alterar sua senha, clique no botão abaixo e um e-mail para redefinição de senha será enviado para o seu e-mail
        cadastrado.
      </h4>
      <button class="btn-alter">Alterar senha</button>
    </div>
    <div class="save-changes">
      <button class="btn-save" @click="updateClient()">Salvar Alterações</button>
      <button class="btn-remove">Fechar</button>
    </div>
  </div>
</template>

<script>
const firebase = require("@/firebaseConfig.js");

export default {
  name: "ChangePersonalData",
  data() {
    return {
      user: {
        name: "",
        email: "",
        phone: ""
      },
      activeclient: ""
    };
  },
  firestore() {
    return {
      users: firebase.usersCollection
    };
  },
  methods: {
    editPersonalData(client) {
      let { id, ...toeditclient } = client;
      this.activeclient = id;
      id = null;
      this.user = Object.assign(this.user, toeditclient);
    },
    updatePersonalData() {
      this.$firestore.users
        .doc(this.activeclient)
        .update(this.user)
        .then(() => {
          this.reset();
        })
        .catch(function(error) {
          console.error("Erro atualizando cliente: ", error);
        });
    }
  }
};
</script>

<style>
.change {
  width: 1200px;
  height: 800px;
  border-radius: 20px;
  padding: 40px;
  background-color: #1e2124;
  color: whitesmoke;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-rows: 10% 15% 20% 20% 20% 15%;
  grid-template-areas:
    "title"
    "description"
    "changename"
    "changephone"
    "changepassword"
    "savechanges";
}

.change input {
  width: 600px;
}

.change span {
  color: rgb(70, 190, 102);
}

.change .title {
  grid-area: title;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.change .description {
  grid-area: description;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.change .change-name {
  grid-area: changename;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.change .change-phone {
  grid-area: changephone;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.change .change-password {
  grid-area: changepassword;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.change .change-password h4 {
  font-weight: 400;
}

.change .save-changes {
  grid-area: savechanges;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change .save-changes button {
  margin: 5px;
}
</style>
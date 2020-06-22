<template>
  <div class="change-password">
    <div class="title">
      <h2>Altere sua senha</h2>
    </div>
    <div class="description">
      <p>Por questões de segurança, a redefinição de senha é feita através do seu e-mail. Insira o e-mail cadastrado na sua conta da South Pine no campo abaixo, clique no botão "Solicitar Alteração de Senha" e um e-mail será enviado para sua redefinição de senha.</p>
    </div>
    <div class="email">
      <input v-model.trim="passwordForm.email" type="text" id="email" />
    </div>
    <div class="confirm">
      <button class="btn-first" @click="resetPassword">Solicitar Alteração de Senha</button>
      <router-link to="/dashclient/personal">
        <button class="btn-second">Fechar</button>
      </router-link>
    </div>
  </div>
</template>

<script>
const firebase = require("../../../firebaseConfig");
export default {
  name: "ChangePassword",
  data() {
    return {
      passwordForm: {
        email: ""
      }
    };
  },
  methods: {
    resetPassword() {
      firebase.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .catch(err => {
          console.log(err);
          this.errorMsg = err.message;
        });
    }
  }
};
</script>

<style>
.change-password {
  width: 600px;
  height: 400px;
  background-color: #1e2124;
  color: whitesmoke;
  border-radius: 20px;
  font-family: "Montserrat", sans-serif;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-rows: 20% 35% 20% 25%;
  grid-template-areas:
    "title"
    "description"
    "email"
    "confirm";
}

.change-password .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-password .description {
  grid-area: description;
  margin: 30px;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-password .email {
  grid-area: email;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.change-password .email input {
  width: 400px;
}

.change-password .confirm {
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-password .confirm button {
  margin: 10px;
}
</style>
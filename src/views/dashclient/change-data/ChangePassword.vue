<template>
  <div class="change-password">
    <div class="title">
      <h2>Alterar senha</h2>
    </div>
    <div class="description">
      <p>Por questões de segurança, a redefinição de senha é feita através do e-mail da sua conta. Clique no botão "Solicitar Alteração de Senha" e um e-mail será enviado
        para sua conta de e-mail cadastrada.
      </p>
    </div>
    <div class="confirm">
      <button class="btn-first">Solicitar Alteração de Senha</button>
      <router-link to="/dashclient/personal">
        <button class="btn-second">Fechar</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword"
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
  grid-template-rows: 20% 55% 25%;
  grid-template-areas: 
    "title"
    "description"
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

.change-password .confirm {
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-password .confirm button {
  margin: 10px;
}
</style>
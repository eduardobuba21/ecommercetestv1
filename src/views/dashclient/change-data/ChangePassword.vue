<template>
  <div class="change-password">
    <div class="title">
      <h2>Altere sua senha</h2>
    </div>
    <div class="description">
      <p>Use o formulário abaixo para alterar sua senha.</p>
    </div>
    <div class="form">
      <p>Senha atual:</p>
      <input type="password" />
      <p>Nova senha:</p>
      <input type="password" />
      <p>Confirme a nova senha:</p>
      <input type="password" />
    </div>
    <div class="confirm">
      <button class="btn-confirm">Salvar Alterações</button>
      <router-link to="/dashclient/personal">
        <button class="btn-close">Fechar</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.change-password {
  height: 500px;
  width: 600px;
  background-color: #1e2124;
  color: whitesmoke;
  border-radius: 20px;
  font-family: "Montserrat", sans-serif;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-rows: 15% 10% 60% 15%;
  grid-template-areas: 
    "title"
    "description"
    "form"
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
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-password .form {
  grid-area: form;
  display: flex;
  flex-direction: column;
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
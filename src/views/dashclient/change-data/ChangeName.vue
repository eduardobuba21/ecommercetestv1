<template>
  <div class="wrap-change">
    <div class="change">
      <div class="title">
        <h3>Altere seu nome</h3>
      </div>
      <div class="description">
        <p>Se quiser alterar o nome associado à sua conta da South Pine, você poderá fazê-lo a seguir. Lembre-se de clicar no botão Salvar alterações quando tiver concluído.</p>
      </div>
      <div class="enter">
        <input type="text" />
      </div>
      <div class="save-changes">
        <button class="btn-confirm">Salvar alterações</button>
        <router-link to="/dashclient/personal">
          <button class="btn-close">Fechar</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeName"
};
</script>

<style>
.wrap-change {
  margin-right: 30px;
  font-family: "Montserrat", sans-serif;
}

.wrap-change .change {
  width: 600px;
  height: 400px;
  border-radius: 20px;
  background-color: #1e2124;
  color: whitesmoke;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-rows: 20% 40% 15% 25%;
  grid-template-areas:
    "changetitle"
    "changedescription"
    "changeinput"
    "changebutton";
}

.wrap-change .change .title {
  grid-area: changetitle;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change .change .description {
  grid-area: changedescription;
  font-family: sans-serif;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change .change .enter {
  grid-area: changeinput;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-change .change .enter input {
  width: 500px;
  height: 30px;
}

.wrap-change .change .save-changes {
  grid-area: changebutton;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrap-change .change .save-changes button {
  margin: 5px;
}
</style>
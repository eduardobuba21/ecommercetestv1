<template>
  <div class="change">
    <div class="title">
      <h2>Altere seu Telefone</h2>
    </div>
    <div class="description">
      <p>Se quiser adicionar ou alterar o telefone associado à sua conta da South Pine, você poderá fazê-lo a seguir. Lembre-se de clicar no botão "Salvar Alterações" quando tiver concluído.</p>
    </div>
    <div class="enter">
      <input type="text /" />
    </div>
    <div class="save-changes">
      <button class="btn-confirm">Salvar Alterações</button>
      <router-link to="/dashclient/personal">
        <button class="btn-close">Fechar</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePhone"
};
</script>

<style>
</style>
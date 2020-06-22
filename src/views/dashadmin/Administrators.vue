<template>
  <div class="administrators">
    <h1>Administradores</h1>
    <p>Página de gerenciamento de administradores.</p>
    <br />
    <button @click="changeRole('3tMoRIX5FgTAVq1I53E8MCjMOa32')"></button>
  </div>
</template>

<script>
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Administrators",
  methods: {
    changeRole(uid) {
      var setUserRole = firebase.functions.httpsCallable("setUserRole");
      var data = { uid: uid, customClaims: { role: "admin" } };
      setUserRole(data)
        .then(function(result) {
          console.log(result);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
<template>
  <div class="wrap-personal">
    <div v-if="exhibdata" class="personal-data">
      <div class="title">
        <h3>Dados Pessoais</h3>
      </div>
      <div class="fields">
        <div class="name">
          <h4>Nome</h4>
          <p>{{userProfile.name}}</p>
        </div>
        <div class="email">
          <h4>E-mail</h4>
          <p>{{currentUser.email}}</p>
        </div>
        <div class="password">
          <h4>Senha</h4>
          <p>*********</p>
        </div>
        <div class="phone">
          <h4>Telefone</h4>
          <p>{{userProfile.phone}}</p>
        </div>
      </div>
      <div class="alter">
        <button class="btn-alter" @click="exhibdata=false">Editar</button>
      </div>
    </div>

    <div v-if="!exhibdata" class="change">
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
      <div class="save-changes">
        <button class="btn-save" @click="updateClient()">Salvar Alterações</button>
        <button class="btn-remove" @click="exhibdata=true">Fechar</button>
      </div>
      <div class="change-password">
        <h4>
          Para alterar sua senha, clique no botão abaixo e um e-mail para redefinição de senha será enviado para o seu e-mail
          cadastrado.
        </h4>
        <button class="btn-alter">Alterar senha</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Personal",
  data() {
    return {
      exhibdata: true,
      user: {
        name: "",
        email: "",
        phone: ""
      },
      activeclient: "",
      activeclientemail: ""
    };
  },
  firestore() {
    return {
      users: firebase.loggedUser
    };
  },
  methods: {
    editPersonalData(client) {
      let { id, ...toeditclient } = client;
      this.activeclient = id;
      id = null;
      this.user = Object.assign(this.user, toeditclient);
      this.activeclientemail = "";
      this.getUserEmail(this.activeclient);
    },
    getUserEmail(uid) {
      this.activeclientemail = "Carregando email...";
      var getUserEmail = firebase.functions.httpsCallable("getUserEmail");
      var data = { uid: uid };
      getUserEmail(data)
        .then(resdata => {
          this.activeclientemail = resdata.data;
        })
        .catch(error => {
          console.log("Erro procurando email:", error);
          this.activeclientemail = "Não foi possível carregar o email.";
        });
    },
    updatePersonalData() {
      this.$firestore.loggedUser
        .doc(this.activeclient)
        .update(this.user)
        .catch(function(error) {
          console.error("Erro atualizando cliente: ", error);
        });
    }
  },
  computed: {
    ...mapGetters(["currentUser", "userProfile"])
  }
};
</script>

<style>
.wrap-personal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .personal-data {
  width: 400px;
  height: 450px;
  border-radius: 20px;
  box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
  background: #1b2124;
  display: grid;
  grid-template-rows: 15% 60% 25%;
  grid-template-areas:
    "title"
    "fields"
    "alter";
}

.wrap-personal .personal-data .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .personal-data .fields {
  grid-area: fields;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 50px;
}

.wrap-personal .personal-data .alter {
  grid-area: alter;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change {
  width: 800px;
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
    "savechanges"
    "changepassword";
}

.wrap-personal .change input {
  width: 600px;
}

.wrap-personal .change span {
  color: rgb(70, 190, 102);
}

.wrap-personal .change .title {
  grid-area: title;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change .description {
  grid-area: description;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.wrap-personal .change .change-name {
  grid-area: changename;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change .change-phone {
  grid-area: changephone;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change .change-password {
  grid-area: changepassword;
  border-top: 1px solid whitesmoke;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change .change-password h4 {
  font-weight: 400;
}

.wrap-personal .change .save-changes {
  grid-area: savechanges;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .change .save-changes button {
  margin: 5px;
}
</style>
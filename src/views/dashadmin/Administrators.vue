<template>
  <div class="administrators">
    <h1>Administradores</h1>
    <p>Página de gerenciamento de administradores.</p>
    <br />

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Add/Edit Admin -->

    <div class="dashadmin-card-2row" v-if="addAdminModal">
      <div class="dashadmin-card-2row-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2 v-if="!editingAdmin">Adicionar Admin</h2>
            <h2 v-else>Editando Admin</h2>
            <button
              v-if="!editingAdmin"
              @click="addAdminModal=false; adminList=true; reset();"
            >VOLTAR</button>
            <button
              v-else
              class="btn-first"
              @click="addAdminModal=false; adminList=true; editingAdmin = false; reset();"
            >CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="dashadmin-card-2row-left">
        <div v-if="editingAdmin" class="dashadmin-card-section">
          <h3>Informações Básicas</h3>
          <label>Código do Admin</label>
          <input type="text" v-model="activeAdmin" disabled />
          <label>Nome</label>
          <input class="inputMaxLength-input" type="text" v-model="admin.name" disabled />
        </div>
        <div v-else class="dashadmin-card-section">
          <h3>Digite o código do usuário</h3>
          <label>Procure pelo usuário que deseja tornar administrador na guia 'Clientes', copie seu código e cole aqui.</label>
          <input type="text" v-model="activeAdmin" />
        </div>
      </div>

      <div class="dashadmin-card-2row-right">
        <button
          v-if="!editingAdmin"
          class="btn-first"
          @click="addAdminConfirmation()"
        >ADICIONAR ADMIN</button>
        <button v-else class="btn-first" @click="revokeAdminConfirmation()">REMOVER DE ADMINISTRADOR</button>
      </div>
    </div>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Deletion Modal -->

    <transition name="fade">
      <div v-if="confirmModal" class="dashadmin-deletionpage">
        <div class="dashadmin-deletionmodal">
          <h1>Você tem certeza?</h1>
          <p v-if="!revokeConfirmModel">Você está prestes a tornar o seguinte usuário administrador:</p>
          <p v-else>Você está prestes a remover os direitos de administrador do usuário:</p>
          <p style="color: #faa61a">{{ toAdminName }}</p>
          <button class="btn-second" @click="confirmModal=false">Cancelar</button>
          <button
            v-if="!revokeConfirmModel"
            class="btn-first"
            @click="changeRole(activeAdmin)"
          >Confirmar</button>
          <button v-else class="btn-first" @click="revokeRole(activeAdmin)">Confirmar</button>
        </div>
      </div>
    </transition>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Admin List -->

    <div class="dashadmin-card-full" v-show="adminList">
      <div class="dashadmin-card-full-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2>Administradores</h2>
            <button
              class="btn-first"
              @click="reset(); addAdminModal=true; adminList=false"
            >ADICIONAR</button>
          </div>
        </div>
      </div>
      <div class="dashadmin-card-full-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th style="width: 100px">Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in admins" :key="admin.id">
              <td>{{ admin.name }}</td>
              <td>
                <button class="tbtn tbtn-second" @click="editAdmin(admin)">EDITAR</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import toast from "@/assets/js/toast.js";
import loading from "@/assets/js/loading.js";
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Administrators",
  data() {
    return {
      addAdminModal: false,
      adminList: true,

      editingAdmin: false,
      activeAdmin: "",

      revokeConfirmModel: false,
      confirmModal: false,
      toAdminName: "",

      admins: [],
      admin: {
        name: "",
        adminimage: ""
      },
      adminbkp: {},

      users: []
    };
  },
  firestore() {
    return {
      users: firebase.usersCollection
    };
  },
  methods: {
    changeRole(uid) {
      loading.switch(true);
      this.confirmModal = false;
      var setUserRole = firebase.functions.httpsCallable("setUserRole");
      var data = { uid: uid, customClaims: { role: "admin" } };
      setUserRole(data)
        .then(() => {
          this.addAdminModal = false;
          this.adminList = true;
          this.reset();
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Admin adicionado!");
        })
        .catch(error => {
          console.log("Erro tornando admin:", error);
          loading.switch(false);
          toast.createToast("Ocorreu um erro inesperado!", false);
        });
    },
    revokeRole(uid) {
      loading.switch(true);
      this.confirmModal = false;
      this.revokeConfirmModel = false;
      var revokeUserRole = firebase.functions.httpsCallable("setUserRole");
      var data = { uid: uid, customClaims: null };
      revokeUserRole(data)
        .then(() => {
          this.addAdminModal = false;
          this.adminList = true;
          this.reset();
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Admin removido!");
        })
        .catch(error => {
          console.log("Erro revogando admin:", error);
          loading.switch(false);
          toast.createToast("Ocorreu um erro inesperado!", false);
        });
    },
    addAdminConfirmation() {
      if (this.activeAdmin == "") {
        toast.createToast("Insira um código!", false);
        return;
      }
      loading.switch(true);
      firebase.usersCollection
        .doc(this.activeAdmin)
        .get()
        .then(doc => {
          loading.switch(false);
          if (doc.exists) {
            if (doc.data().customClaims) {
              if (doc.data().customClaims.role == "admin") {
                toast.createToast("Usuário já é admin!", false);
                return;
              }
            }
            this.toAdminName = doc.data().name;
            this.confirmModal = true;
          } else {
            toast.createToast("Usuário não encontrado!", false);
          }
        })
        .catch(error => {
          loading.switch(false);
          console.log("Erro procurando usuário:", error);
          toast.createToast("Ocorreu um erro inesperado!", false);
        });
    },
    revokeAdminConfirmation() {
      loading.switch(true);
      firebase.usersCollection
        .doc(this.activeAdmin)
        .get()
        .then(doc => {
          loading.switch(false);
          this.toAdminName = doc.data().name;
          this.revokeConfirmModel = true;
          this.confirmModal = true;
        })
        .catch(error => {
          loading.switch(false);
          console.log("Erro procurando usuário:", error);
          toast.createToast("Ocorreu um erro inesperado!", false);
        });
    },
    editAdmin(admin) {
      let { id, ...toeditadmin } = admin;
      this.activeAdmin = id;
      id = null;
      this.admin = Object.assign(this.admin, toeditadmin);
      this.addAdminModal = true;
      this.editingAdmin = true;
      this.adminList = false;
    },
    fetchAdminList() {
      this.admins = [];
      firebase.usersCollection.get().then(snap => {
        snap.forEach(doc => {
          var user = doc.data();
          user.id = doc.id;
          if (user.customClaims)
            if (user.customClaims.role == "admin") this.admins.push(user);
        });
      });
    },
    reset() {
      this.admin = Object.assign({}, this.adminbkp);
      this.activeAdmin = "";
      this.fetchAdminList();
    }
  },
  created() {
    this.adminbkp = Object.assign({}, this.admin);
    this.fetchAdminList();
  }
};
</script>

<style>
</style>
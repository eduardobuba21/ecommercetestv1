<template>
  <div class="clients">
    <h1>Clientes</h1>
    <p>Aqui você pode gerenciar as informações de seus clientes.</p>
    <br />

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Edit Client -->

    <div class="dashadmin-card-2row" v-if="editClientModal">
      <div class="dashadmin-card-2row-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2>Editar Cliente</h2>
            <button
              class="btn-first"
              @click="editClientModal=false; clientList=true; reset();"
            >CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="dashadmin-card-2row-left">
        <div class="dashadmin-card-section">
          <label>Código do Cliente</label>
          <div class="editingProduct-idanddelete">
            <input type="text" v-model="activeclient" disabled />
            <button @click="deletionModal=true; deletionClient=user;">DELETAR CLIENTE</button>
          </div>
        </div>

        <div class="dashadmin-card-section">
          <h3>Visão Geral</h3>
          <label>Nome</label>
          <input class="inputMaxLength-input" maxlength="50" type="text" v-model="user.name" />
          <p class="inputMaxLength-p" v-text="(50 - user.name.length) + '/50'"></p>
          <label>CPF</label>
          <the-mask :mask="'###.###.###-##'" :masked="true" v-model="user.cpf" />
          <label>Telefone</label>
          <the-mask
            :mask="['(##) ####-####', '(##) #####-####']"
            :masked="true"
            v-model="user.phone"
          />
          <label>E-mail</label>
          <input class="input-obs" maxlength="50" type="text" v-model="user.email" disabled />
          <span class="input-obs-span">Apenas o cliente pode alterar seu e-mail e senha.</span>
          <div class="switch-wrap">
            <input id="switchcheckbox" type="checkbox" class="hidden" v-model="user.marketingmails" />
            <label for="switchcheckbox" id="switch"></label>
            <p>Inscrito nos e-mails de marketing</p>
          </div>
        </div>

        <div class="dashadmin-card-section">
          <h3>Endereço</h3>
          <label>Destinatário</label>
          <input
            class="inputMaxLength-input"
            maxlength="50"
            type="text"
            v-model="user.addressrecipient"
          />
          <p class="inputMaxLength-p" v-text="(50 - user.addressrecipient.length) + '/50'"></p>
          <label>Telefone</label>
          <the-mask
            :mask="['(##) ####-####', '(##) #####-####']"
            :masked="true"
            v-model="user.addressphone"
          />
          <label>CEP</label>
          <the-mask :mask="'#####-###'" :masked="true" v-model="user.addresspostcode" />
          <label>Endereço</label>
          <input class="inputMaxLength-input" maxlength="50" type="text" v-model="user.address" />
          <p class="inputMaxLength-p" v-text="(50 - user.address.length) + '/50'"></p>
          <label>Número</label>
          <input maxlength="5" type="text" v-model="user.addressnumber" />
          <label>Complemento</label>
          <input maxlength="20" type="text" v-model="user.addresscomplement" />
          <label>Bairro</label>
          <input maxlength="40" type="text" v-model="user.addressneighborhood" />
          <label>Cidade</label>
          <input maxlength="40" type="text" v-model="user.addresscity" disabled />
          <label>Estado</label>
          <input maxlength="40" type="text" v-model="user.addressstate" disabled />
        </div>
      </div>
      <div class="dashadmin-card-2row-right">
        <button class="btn-first" @click="updateClient()">SALVAR ALTERAÇÕES</button>
      </div>
    </div>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Deletion Modal -->

    <transition name="fade">
      <div v-if="deletionModal" class="dashadmin-deletionpage">
        <div class="dashadmin-deletionmodal">
          <h1>Você tem certeza?</h1>
          <p>Você está prestes a excluir o seguinte cliente:</p>
          <p style="color: #faa61a">{{ deletionClient.name }}</p>
          <button class="btn-second" @click="deletionModal=false">Cancelar</button>
          <button class="btn-first" @click="deleteClient(deletionClient)">Excluir</button>
        </div>
      </div>
    </transition>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Clients List -->

    <div class="dashadmin-card-full" v-show="clientList">
      <div class="dashadmin-card-full-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2>Clientes Cadastrados</h2>
          </div>
        </div>
      </div>
      <div class="dashadmin-card-full-table">
        <table v-if="users.length">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th style="width: 140px">Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td style="width: 200px">{{ user.cpf }}</td>
              <td>
                <button class="tbtn tbtn-second" @click="editClient(user)">EDITAR</button>
                <span style="padding: 4px"></span>
                <button class="tbtn" @click="deletionModal=true; deletionClient=user;">EXCLUIR</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="dashadmin-card-section dashadmin-table-empty">
            <div class="dashadmin-table-empty-card">
              <p
                style="margin-bottom: 0; font-size: 1.2rem;"
              >Você verá os clientes aqui quando cadastrados.</p>
            </div>

            <button class="btn-first">ADICIONAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toast from "@/assets/js/toast.js";
import loading from "@/assets/js/loading.js";
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Clients",
  data() {
    return {
      clientList: true,
      editClientModal: false,
      deletionModal: false,

      users: [],
      user: {
        // Customer Overview
        name: "",
        cpf: "",
        phone: "",
        marketingmails: false,

        // Address
        addressrecipient: "",
        addressphone: "",
        addresspostcode: "",
        address: "",
        addressnumber: "",
        addresscomplement: "",
        addressneighborhood: "",
        addresscity: "",
        addressstate: ""
      },
      activeclient: "",
      activeclientemail: "",

      deletionClient: {},

      userbkp: {}
    };
  },
  firestore() {
    return {
      users: firebase.usersCollection
    };
  },
  methods: {
    editClient(client) {
      let { id, ...toeditclient } = client;
      this.activeclient = id;
      id = null;
      this.user = Object.assign(this.user, toeditclient);
      this.editClientModal = true;
      this.clientList = false;
    },
    updateClient() {
      loading.switch(true);
      this.$firestore.users
        .doc(this.activeclient)
        .update(this.user)
        .then(() => {
          this.editClientModal = false;
          this.clientList = true;
          this.reset();
          loading.switch(false);
          toast.createToast("Informações Atualizadas!");
        })
        .catch(function(error) {
          console.error("Erro atualizando cliente: ", error);
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Erro enviando dados!", false);
        });
    },
    deleteClient(client) {
      loading.switch(true);
      var delclientid = "";
      if (client.id) {
        delclientid = client.id;
      } else {
        delclientid = this.activeclient;
      }
      this.$firestore.users
        .doc(delclientid)
        .delete()
        .then(() => {
          this.deletionModal = false;
          this.deletionClient = {};
          this.editClientModal = false;
          this.clientList = true;
          loading.switch(false);
          toast.createToast("Cliente deletado!");
        })
        .catch(function(error) {
          console.log("Erro deletando cliente: ", error);
          this.deletionModal = false;
          this.deletionClient = {};
          loading.switch(false);
          toast.createToast("Erro deletando cliente!", false);
        });
    },
    reset() {
      this.user = Object.assign({}, this.userbkp);
      this.activeclient = "";
      this.activeclientemail = "";
      this.deletionClient = {};
    }
  },
  created() {
    this.userbkp = Object.assign({}, this.user);
  }
};
</script>

<style>
</style>
<template>
  <div class="wrap-address">
    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- add address button -->

    <div class="address-data" v-if="exhibdata">
      <div class="add-address" @click="exhibdata=false; addAddr=true">
        <svg>
          <use xlink:href="@/assets/icons.svg#add" />
        </svg>
        <p>Adicionar novo Endereço</p>
      </div>

      <div v-if="addrs.length !== 0">
        <div v-for="address in addrs" :key="address.id">
          <div class="address">
            <div class="title">
              <h3>Endereço de Entrega</h3>
              <div class="defaultAddress" v-if="address.id === defaultAddress">
                <h3>Padrão</h3>
                <svg class="icon">
                  <use xlink:href="@/assets/icons.svg#right" />
                </svg>
              </div>
            </div>
            <div class="street">
              <h4>Rua e Nº</h4>
              <p>{{address.EE.Mt.proto.mapValue.fields.street.stringValue}}, {{address.EE.Mt.proto.mapValue.fields.number.stringValue}}</p>
            </div>
            <div class="type">
              <h4>Referência/Complemento</h4>
              <p>{{address.EE.Mt.proto.mapValue.fields.complement.stringValue}}</p>
            </div>
            <div class="city-state-cep">
              <h4>Cidade, Estado e CEP</h4>
              <p>{{address.EE.Mt.proto.mapValue.fields.city.stringValue}}, {{address.EE.Mt.proto.mapValue.fields.state.stringValue}}, {{address.EE.Mt.proto.mapValue.fields.postcode.stringValue}}</p>
            </div>
            <div class="recipient">
              <h4>Recebedor</h4>
              <p>{{address.EE.Mt.proto.mapValue.fields.recipient.stringValue}}</p>
            </div>
            <div class="options">
              <div class="buttons">
                <button
                  class="btn-alter"
                  @click="addAddr=true, editAddress(address), editingAddress=true, exhibdata=false"
                >Editar</button>
                <button
                  class="btn-remove"
                  @click="deletionAddressModal=true, deletionAddress=address, activeaddress=address.id"
                >Excluir</button>
              </div>
              <div v-if="!(address.id === defaultAddress)">
                <a
                  @click="setDefaultAddress(address.id)"
                >Tornar Endereço Padrão</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-addrs" v-else-if="carregando">
        <h3>Carregando...</h3>
      </div>
      <div class="empty-addrs" v-else>
        <h3>Você ainda não possui endereços cadastrados</h3>
      </div>
    </div>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- delete address -->

    <transition name="fade">
      <div v-if="deletionAddressModal" class="deletion-address-modal">
        <div class="delete-address-card">
          <h1>Você tem certeza?</h1>
          <p>Você está prestes a excluir o seguinte endereço:</p>
          <p
            style="color: #faa61a"
          >{{deletionAddress.EE.Mt.proto.mapValue.fields.city.stringValue}}, {{deletionAddress.EE.Mt.proto.mapValue.fields.state.stringValue}}. {{deletionAddress.EE.Mt.proto.mapValue.fields.street.stringValue}}, {{deletionAddress.EE.Mt.proto.mapValue.fields.number.stringValue}}</p>
          <div class="delete-addressoptions">
            <button class="btn-first" @click="deletionAddressModal=false">Cancelar</button>
            <button class="btn-remove" @click="deleteAddress(deletionAddress)">Excluir</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- add/edit address -->

    <div v-if="addAddr">
      <div class="wrap-change-address">
        <div class="change-address-form">
          <div class="title">
            <h2 v-if="!editingAddress">Adicionar Novo Endereço</h2>
            <h2 v-else>Editar Endereço</h2>
          </div>
          <div class="form">
            <label for="postcode">
              <h3>CEP:</h3>
              <input
                name="cep"
                type="text"
                id="cep"
                v-model="address.postcode"
                size="10"
                maxlength="9"
                @blur="search_postcode(address.postcode);"
                placeholder="Insira o CEP"
              />
            </label>
            <label for="state">
              <h3>Estado:</h3>
              <input name="uf" type="text" id="uf" v-model="address.state" size="2" disabled />
            </label>
            <label for="city">
              <h3>Cidade:</h3>
              <input
                name="cidade"
                type="text"
                id="cidade"
                v-model="address.city"
                size="40"
                disabled
              />
            </label>
            <label for="neighborhood">
              <h3>Bairro:</h3>
              <input
                name="bairro"
                type="text"
                id="bairro"
                v-model="address.neighborhood"
                size="40"
                placeholder="Nome do bairro"
              />
            </label>
            <label for="street">
              <h3>Rua:</h3>
              <input
                name="rua"
                type="text"
                id="rua"
                v-model="address.street"
                size="60"
                placeholder="Nome da rua"
              />
            </label>
            <label for="number">
              <h3>Número:</h3>
              <input
                name="numero"
                type="text"
                id="numero"
                v-model="address.number"
                size="5"
                placeholder="Ex: 36"
              />
            </label>
            <label for="complement">
              <h3>Complemento:</h3>
              <input
                name="complemento"
                type="text"
                id="complemento"
                v-model="address.complement"
                size="60"
                placeholder="Pontos de referência, cor da casa ou outras referências"
              />
            </label>
            <label for="recipient">
              <h3>Recebedor:</h3>
              <input
                name="recebedor"
                type="text"
                id="recebedor"
                v-model="address.recipient"
                size="60"
                placeholder="Nome de quem receberá o pedido"
              />
            </label>
            <label for="phone">
              <h3>Telefone do Recebedor:</h3>
              <input
                name="telefone"
                type="text"
                id="telefone"
                v-model="address.phone"
                size="60"
                placeholder="(**) *****-****"
              />
            </label>
          </div>
          <div class="actions">
            <button v-if="!editingAddress" class="btn-save" @click="addAddress()">Salvar</button>
            <button v-else class="btn-save" @click="updateAddress()">Salvar Alterações</button>
            <button
              class="btn-remove"
              @click="addAddr=false, exhibdata=true, editingAddress=false, resetAddress()"
            >Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toast from "../../assets/js/toast";
// import loading from "../../assets/js/loading"
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Address",
  data() {
    return {
      exhibdata: true,
      addAddr: false,
      editingAddress: false,
      carregando: false,

      activeaddress: "",
      deletionAddress: {},
      deletionAddressModal: false,
      defaultAddress: "",

      addrs: [],
      address: {
        street: "",
        city: "",
        complement: "",
        number: "",
        phone: "",
        postcode: "",
        recipient: "",
        state: "",
        neighborhood: "",
      },
    };
  },
  methods: {
    search_postcode(value) {
      this.$viaCep.buscarCep(value).then((obj) => {
        this.address.city = obj.localidade;
        this.address.state = obj.uf;
      });
    },
    addAddress() {
      // loading.switch(true)
      let id = firebase.fdb.ref().child("addresses").push().key;
      firebase.db.collection("addresses").doc(id).set(this.address);
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser.uid)
        .update({
          addresses: firebase.firestore.FieldValue.arrayUnion(id),
        })
        .then(() => {
          this.resetAddress();
          // loading.switch(false)
          this.addAddr = false;
          this.exhibdata = true;
          toast.createToast("Endereço Adicionado!");
        })
        .catch(function (error) {
          console.error("Erro adicionando endereço: ", error);
        });
    },
    editAddress(address) {
      this.activeaddress = address.id;
      this.address.street =
        address.EE.Mt.proto.mapValue.fields.street.stringValue;
      this.address.city = address.EE.Mt.proto.mapValue.fields.city.stringValue;
      this.address.complement =
        address.EE.Mt.proto.mapValue.fields.complement.stringValue;
      this.address.number =
        address.EE.Mt.proto.mapValue.fields.number.stringValue;
      this.address.phone =
        address.EE.Mt.proto.mapValue.fields.phone.stringValue;
      this.address.postcode =
        address.EE.Mt.proto.mapValue.fields.postcode.stringValue;
      this.address.recipient =
        address.EE.Mt.proto.mapValue.fields.recipient.stringValue;
      this.address.state =
        address.EE.Mt.proto.mapValue.fields.state.stringValue;
      this.address.neighborhood =
        address.EE.Mt.proto.mapValue.fields.neighborhood.stringValue;
      this.addAddr = true;
      this.editingAddress = true;
    },
    setDefaultAddress(addressid) {
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser.uid)
        .update({
          defaultAddress: addressid,
        })
        .then(() => {
          this.defaultAddress = addressid;
          toast.createToast("Endereço padrão definido!");
        })
        .catch((error) => {
          console.error("Erro ao definir endereço padrão: ", error);
        });
    },
    loadAddresses() {
      // loading.switch(true)
      // this.addrs = [];
      this.carregando = true;
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then((doc) => {
          this.clientAddress = Object.values(doc.data().addresses);
          this.clientAddress.forEach((address) => {
            firebase.db
              .collection("addresses")
              .doc(address)
              .get()
              .then((doc) => {
                this.addrs.push(doc);
                this.carregando = false;
                // loading.switch(false)
              });
          });
        })
        .then(() => {
          firebase.db
            .collection("users")
            .doc(firebase.auth.currentUser.uid)
            .get()
            .then((doc) => {
              this.defaultAddress = doc.data().defaultAddress;
            });
        })
        .catch((error) => {
          console.error("Erro no get Orders: ", error);
        });
    },
    deleteAddress(address) {
      // pegando o id do endereço a ser excluído
      var deladdressid = "";
      if (address.id) {
        deladdressid = address.id;
      } else {
        deladdressid = this.activeaddress;
      }

      // Excluindo o documento de endereço de entrega da coleção addresses
      firebase.db.collection("addresses").doc(deladdressid).delete();

      // Excluindo o id do endereço de entrega do array de endereços do usuário
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then((doc) => {
          // identifica-se o id que se desja excluir do array, troca-o de posição com o último elemento do array e então usa-se o método pop.
          let userAddresses = doc.data().addresses;
          let toExclude = userAddresses.indexOf(deladdressid);
          let temp = userAddresses[userAddresses.length - 1];
          userAddresses[userAddresses.length - 1] = userAddresses[toExclude];
          userAddresses[toExclude] = temp;
          userAddresses.pop();
          // atualizando a lista de ids de endereços no documento do usuário
          firebase.db
            .collection("users")
            .doc(firebase.auth.currentUser.uid)
            .update({
              addresses: userAddresses,
            });
        })
        // Retornando ao usuário mensagem de sucesso e resetando o array addrs(que está em data() do Vue) para exibir a lista atualizada de endereços
        .then(() => {
          this.deletionAddressModal = false;
          toast.createToast("Endereço Excluído");
          this.addrs = [];
          this.loadAddresses();
        })
        .catch((error) => {
          console.log("erro: ", error);
          toast.createToast("Erro ao excluir endereço", false);
        });
    },
    resetAddress() {
      this.address = Object.assign({});
      this.activeaddress = Object.assign({});
      this.addrs = [];
      this.loadAddresses();
    },
    updateAddress() {
      firebase.db
        .collection("addresses")
        .doc(this.activeaddress)
        .update(this.address)
        .then(() => {
          this.addAddr = false;
          this.editingAddress = false;
          this.exhibdata = true;
          toast.createToast("Alteração realizada com sucesso!");
          this.addrs = [];
          this.loadAddresses();
        });
    },
  },
  created() {
    this.loadAddresses();
  },
};
</script>

<style>
.wrap-address {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
}

.wrap-address .address-data .address {
  background-color: #1b2124;
  color: whitesmoke;
  width: 400px;
  height: 350px;
  border-radius: 20px;
  padding: 30px;
  margin: 30px;
  display: grid;
  grid-template-rows: 10% 20% 15% 15% 15% 25%;
  grid-template-areas:
    "title"
    "street"
    "type"
    "csp"
    "recipient"
    "options";
}

.wrap-address .address .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .address .title .defaultAddress {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}

.wrap-address .address .title .defaultAddress svg {
  fill: whitesmoke;
  height: 25px;
  margin-bottom: 15px;
  align-self: center;
}

.wrap-address .address .street {
  grid-area: street;
  border-top: 1px solid whitesmoke;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.wrap-address .address .type {
  grid-area: type;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.wrap-address .address .city-state-cep {
  grid-area: csp;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.wrap-address .address .recipient {
  grid-area: recipient;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.wrap-address .address .options {
  grid-area: options;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-address .address-data .options .buttons {
  margin-bottom: 10px;
}

.wrap-address .address-data p {
  font-weight: 100;
}

.wrap-address button {
  margin: 5px;
}

.wrap-address .empty-addrs {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px;
}

.wrap-address .change-address-form {
  position: relative;
  width: 700px;
  height: 1200px;
  border-radius: 20px;
  padding: 50px;
  color: whitesmoke;
  background-color: #1e2124;
  box-shadow: 0 7px 9px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-rows: 10% 80% 10%;
  grid-template-areas:
    "title"
    "form"
    "actions";
}

.wrap-address .change-address-form .title {
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .change-address-form .form {
  grid-area: form;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}

.wrap-address .change-address-form .actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .deletion-address-modal {
  position: fixed;
  z-index: 1;
  background-color: #1e2124c2;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-address .delete-address-card {
  background-color: #36393f;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
}

.wrap-address .delete-adress-card .delete-address-options {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-address .address-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-address .address-data .add-address {
  display: flex;
  height: 75px;
  width: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: dashed 2px whitesmoke;
  border-radius: 20px;
  padding: 10px;
  cursor: pointer;
}

.wrap-address .address-data .add-address:hover {
  box-shadow: 0 7px 9px rgba(0, 0, 0, 0.3);
}

.wrap-address .address-data .add-address svg {
  fill: whitesmoke;
  height: 35px;
  width: auto;
  margin: 7px;
}
</style>
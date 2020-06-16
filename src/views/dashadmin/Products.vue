<template>
  <div class="cproducts">
    <h1>Produtos</h1>
    <p>Aqui você pode gerenciar os produtos cadastrados e cadastrar novos produtos.</p>

    <!-- <button @click="toastTest()"></button> -->
    <br />
    <br />
    <br />

    <div class="dash-card" v-if="addProductModal">
      <div class="dash-card-titlebtn">
        <h2>Adicionar Produto</h2>
        <button class="btn-primary-filled" @click="addProductModal=false; productList=true">X</button>
      </div>
      <div class="form">
        <input type="text" placeholder="Nome" v-model="product.name" />
        <input type="text" placeholder="Preço" v-model="product.price" />
        <input type="file" @change="uploadImage" />
      </div>
      <button class="btn-secondary" @click="addProduct()">ADICIONAR</button>

      <div>
        <div v-for="(image, index) in product.image" :key="image.id">
          <div class="imgwrap">
            <img :src="image" width="80px" />
            <span @click="deleteImage(image, index)">X</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dash-card" v-if="editProductModal">
      <div class="dash-card-titlebtn">
        <h2>Edit Product</h2>
        <button class="btn-primary-filled" @click="editProductModal=false; productList=true">X</button>
      </div>
      <div class="form">
        <input type="text" placeholder="Product ID" v-model="activeproduct" disabled />
        <input type="text" placeholder="Product name" v-model="editedproduct.name" />
        <input type="text" placeholder="Price" v-model="editedproduct.price" />
      </div>
      <button class="btn-secondary" @click="updateProduct()">SALVAR</button>
    </div>

    <transition name="fade">
      <div v-if="deletionModal" class="productdeletionpage">
        <div class="productdeletionmodal">
          <h1>Você tem certeza?</h1>
          <p>Você está prestes a excluir o seguinte produto:</p>
          <p style="color: #faa61a">{{ deletionProduct.name }}</p>
          <button class="btn-second" @click="deletionModal=false">Cancelar</button>
          <button class="btn-first" @click="deleteProduct(deletionProduct)">Excluir</button>
        </div>
      </div>
    </transition>

    <div class="dash-card" v-show="productList">
      <div class="dash-card-titlebtn">
        <h2>Produtos Cadastrados</h2>
        <button class="btn-first" @click="addProductModal=true; productList=false">ADICIONAR</button>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 70%">Nome</th>
            <th style="width: 15%">Preço</th>
            <th style="width: 15%">Opções</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>R$ {{ product.price }},00</td>
            <td>
              <button class="tbtn tbtn-second" @click="editProduct(product)">EDITAR</button>
              <span style="padding: 4px"></span>
              <button class="tbtn" @click="deletionModal=true; deletionProduct=product;">EXCLUIR</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import toast from "@/assets/js/toast.js";
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Products",
  data() {
    return {
      addProductModal: false,
      editProductModal: false,
      productList: true,

      deletionModal: false,
      deletionProduct: "",

      products: [],
      product: {
        name: null,
        price: null,
        image: []
      },
      editedproduct: {
        id: null,
        name: null,
        price: null,
        image: []
      },
      activeproduct: null
    };
  },
  firestore() {
    return {
      products: firebase.productsCollection
    };
  },
  methods: {
    toastTest() {
      toast.createToast("Produto adicionado!");
    },
    addProduct() {
      this.$firestore.products.add(this.product);
      this.reset();
    },
    uploadImage(e) {
      if (e.target.files[0]) {
        let file = e.target.files[0];
        var storageRef = firebase.storage.ref("products/" + file.name);
        let uploadTask = storageRef.put(file);

        uploadTask.on(
          "state_changed",
          () => {},
          error => {
            console.log("Error uploading image: ", error);
          },
          () => {
            console.log("Uploaded");
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.product.image.push(downloadURL);
              console.log(downloadURL);
            });
          }
        );
      }
    },
    deleteImage(img, index) {
      let image = firebase.storage.refFromURL(img);
      this.product.image.splice(index, 1);
      image
        .delete()
        .then(() => {
          console.log("Image Deleted");
        })
        .catch(error => {
          console.log("Error deleting Image: ", error);
        });
    },
    editProduct(product) {
      let { id, ...toeditproduct } = product;
      this.activeproduct = id;
      id = null;
      this.editedproduct = toeditproduct;
      this.editProductModal = true;
      this.productList = false;
    },
    updateProduct() {
      this.$firestore.products
        .doc(this.activeproduct)
        .update(this.editedproduct);
      this.reset();
    },
    deleteProduct(product) {
      this.$firestore.products.doc(product.id).delete();
      this.deletionModal = false;
      this.deletionProduct = "";
    },
    reset() {
      this.product = {
        name: null,
        price: null,
        image: []
      };
      this.editedproduct = {
        id: null,
        name: null,
        price: null,
        image: []
      };
      this.activeproduct = null;
    }
  }
};
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
}

.form input {
  margin: 10px 0 10px 0;
}

.images span {
  position: absolute;
  top: -14px;
  left: -2px;
}

.images span:hover {
  cursor: pointer;
}

.productdeletionpage {
  position: fixed;
  z-index: 1;
  background-color: #1e2124c2;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.productdeletionmodal {
  background-color: #36393f;
  border-radius: 10px;
  width: 500px;
  padding: 40px;
  text-align: center;
}

.productdeletionmodal h1 {
  margin-bottom: 10px;
}

.productdeletionmodal button {
  width: 120px;
  margin: 20px 10px 0 10px;
}
</style>
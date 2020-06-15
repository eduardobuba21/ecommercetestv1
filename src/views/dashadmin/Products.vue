<template>
  <div class="cproducts">
    <h1>Produtos</h1>
    <p>Aqui você pode gerenciar os produtos cadastrados e cadastrar novos produtos.</p>
    <br />
    <br />
    <br />

    <div class="dash-card" v-if="addProductModal">
      <div class="dash-card-titlebtn">
        <h1>Adicionar Produto</h1>
        <button class="btn-close" @click="addProductModal=false; productList=true">X</button>
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
        <h1>Edit Product</h1>
        <button class="btn-close" @click="editProductModal=false; productList=true">X</button>
      </div>
      <div class="form">
        <input type="text" placeholder="Product ID" v-model="activeproduct" disabled />
        <input type="text" placeholder="Product name" v-model="editedproduct.name" />
        <input type="text" placeholder="Price" v-model="editedproduct.price" />
      </div>
      <button class="btn-secondary" @click="updateProduct()">SALVAR</button>
    </div>

    <div class="dash-card" v-show="productList">
      <div class="dash-card-titlebtn">
        <h1>Produtos Cadastrados</h1>
        <button class="btn-secondary" @click="addProductModal=true; productList=false">ADICIONAR</button>
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
              <button class="btn-secondary tbtn-secondary" @click="editProduct(product)">EDITAR</button>
              <span style="padding: 4px"></span>
              <button class="btn-close tbtn-close" @click="deleteProduct(product)">EXCLUIR</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Products",
  data() {
    return {
      addProductModal: false,
      editProductModal: false,
      productList: true,

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
</style>
<template>
  <div class="cproducts">
    <h1>Produtos</h1>
    <p>Aqui você pode gerenciar os produtos cadastrados e cadastrar novos produtos.</p>

    <!-- <button @click="toastTest()"></button> -->
    <br />
    <br />
    <br />

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Add Product -->

    <div class="dashadmin-card-2row" v-if="addProductModal">
      <div class="dashadmin-card-2row-header">
        <div class="dash-card-titlebtn">
          <h2>Adicionar Produto</h2>
          <button class="btn-primary-filled" @click="addProductModal=false; productList=true">X</button>
        </div>
      </div>

      <div class="dashadmin-card-2row-left">
        <div class="dashadmin-card-section">
          <label>Nome</label>
          <input type="text" v-model="product.name" />
          <label>Descrição</label>
          <textarea rows="8" v-model="product.description" />
        </div>

        <div class="dashadmin-card-section">
          <div class="imgInput-wrap">
            <div class="imgInput-preview-wrap" v-if="product.image">
              <div class="imgInput-preview" v-for="(image, index) in product.image" :key="image.id">
                <img :src="image" />
                <svg @click="deleteImage(image, index)">
                  <use xlink:href="@/assets/icons.svg#close" />
                </svg>
              </div>
            </div>
            <div class="imgInput-nopreview">Adicione as imagens aqui utilizando o botão abaixo!</div>
            <div v-if="performingUpload" class="imgInput-msg">{{ performingUpload }}</div>
            <input ref="imgInput" type="file" @change="uploadImage" hidden />
            <button class="btn-first btn-inputfile" @click="$refs.imgInput.click()">
              <svg>
                <use xlink:href="@/assets/icons.svg#cloud" />
              </svg>
              Adicionar Imagem
            </button>
          </div>
        </div>
      </div>
      <div class="dashadmin-card-2row-right">
        <div class="dashadmin-card-section">
          <label>Preço</label>
          <input type="text" v-model="product.price" />
          <label>Preço de comparação</label>
          <input type="text" v-model="product.comparePrice" />
          <label>Custo</label>
          <input type="text" v-model="product.cost" />
        </div>

        <div class="dashadmin-card-section">
          <label>Quantidade</label>
          <input type="text" v-model="product.quantity" />
          <label>Código de barras</label>
          <input type="text" v-model="product.barcode" />
          <label>SKU</label>
          <input type="text" v-model="product.sku" />
        </div>

        <div class="dashadmin-card-section">
          <label>Peso</label>
          <input type="text" v-model="product.weight" />
        </div>

        <div class="dashadmin-card-section">
          <label>Categoria</label>
          <input type="text" v-model="product.type" />
          <label>Fabricante</label>
          <input type="text" v-model="product.vendor" />
        </div>
        <button class="btn-first" @click="addProduct()">SALVAR</button>
      </div>
    </div>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Edit Product -->

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

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Product List -->

    <div class="dash-card" v-show="productList">
      <div class="dash-card-titlebtn">
        <h2>Produtos Cadastrados</h2>
        <button class="btn-first" @click="addProductModal=true; productList=false">ADICIONAR</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th style="width: 120px">Preço</th>
            <th style="width: 140px">Opções</th>
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

      performingUpload: "",

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
      this.performingUpload = "Enviando imagem, aguarde...";
      if (e.target.files[0]) {
        let file = e.target.files[0];
        var storageRef = firebase.storage.ref("products/" + file.name);
        let uploadTask = storageRef.put(file);

        uploadTask.on(
          "state_changed",
          () => {},
          error => {
            // console.log("Error uploading image: ", error);
            this.performingUpload =
              "Ocorreu um erro ao enviar a imagem: " + error;
          },
          () => {
            this.performingUpload = "";
            var preview = document.getElementsByClassName(
              "imgInput-nopreview"
            )[0];
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.product.image.push(downloadURL);
            });
            if (preview) preview.remove();
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
/* ======================================================================== */
/* Add Product */

.dashadmin-card-2row {
  display: grid;
  grid:
    "dashadmin-card-2row-header dashadmin-card-2row-header" 100px
    "dashadmin-card-2row-left dashadmin-card-2row-right" 100%
    / 70% 30%;
}

.dashadmin-card-2row-header {
  grid-area: dashadmin-card-2row-header;
}

.dashadmin-card-2row-left {
  grid-area: dashadmin-card-2row-left;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.dashadmin-card-2row-right {
  grid-area: dashadmin-card-2row-right;
  display: flex;
  flex-direction: column;
}

.dashadmin-card-section {
  background: #282b30;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.dashadmin-card-section > :last-child {
  margin-bottom: 0;
}

/* ======================================================================== */
/* Deletion Page */

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
  padding: 40px;
  text-align: center;
  max-width: 500px;
}

.productdeletionmodal h1 {
  margin-bottom: 10px;
}

.productdeletionmodal button {
  width: 120px;
  margin: 20px 10px 0 10px;
}
</style>
<template>
  <div class="cproducts">
    <h1>Produtos</h1>
    <p>Aqui você pode gerenciar os produtos cadastrados e cadastrar novos produtos.</p>
    <br />
    <br />
    <br />

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Add/Edit Product -->

    <div class="dashadmin-card-2row" v-if="addProductModal">
      <div class="dashadmin-card-2row-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2 v-if="!editingProduct">Adicionar Produto</h2>
            <h2 v-else>Editando Produto</h2>
            <button v-if="!editingProduct" @click="addProductModal=false; productList=true">VOLTAR</button>
            <button
              v-else
              class="btn-first"
              @click="addProductModal=false; productList=true; editingProduct = false; reset();"
            >CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="dashadmin-card-2row-left">
        <div v-if="editingProduct" class="dashadmin-card-section">
          <label>Código do Produto</label>
          <input type="text" v-model="activeproduct" disabled />
        </div>
        <div class="dashadmin-card-section">
          <h3>Informações Básicas</h3>
          <label>Nome</label>
          <input class="inputMaxLength-input" maxlength="50" type="text" v-model="product.name" />
          <p class="inputMaxLength-p" v-text="(50 - product.name.length) + '/50'"></p>
          <label>Descrição</label>
          <textarea
            class="inputMaxLength-input"
            maxlength="1000"
            rows="8"
            v-model="product.description"
          />
          <p class="inputMaxLength-p" v-text="(1000 - product.description.length) + '/1000'"></p>
        </div>

        <div class="dashadmin-card-section">
          <h3>Imagens</h3>
          <div class="imgInput-wrap">
            <div class="imgInput-preview-wrap" v-if="product.image">
              <div class="imgInput-preview" v-for="(image, index) in product.image" :key="image.id">
                <img :src="image" />
                <svg @click="deleteImage(image, index)">
                  <use xlink:href="@/assets/icons.svg#close" />
                </svg>
              </div>
            </div>
            <div
              v-if="!editingProduct || !editingProductImg"
              class="imgInput-nopreview"
            >Adicione as imagens aqui utilizando o botão abaixo!</div>
            <div v-if="performingUploadMsgShow" class="imgInput-msg">{{ performingUploadMsg }}</div>
            <input ref="imgInput" type="file" @change="uploadImage" hidden />
            <button class="btn-first btn-inputfile" @click="$refs.imgInput.click()">
              <svg>
                <use xlink:href="@/assets/icons.svg#cloud" />
              </svg>
              Adicionar Imagem
            </button>
          </div>
        </div>
        <div class="dashadmin-card-section">
          <h3>Variações</h3>
          <div class="switch-wrap">
            <input id="switchcheckbox" type="checkbox" class="hidden" v-model="haveVariants" />
            <label for="switchcheckbox" id="switch"></label>
            <p>Este produto possuí variações</p>
          </div>
          <div v-if="haveVariants">
            <p>*Pendente*</p>
          </div>
        </div>
      </div>
      <div class="dashadmin-card-2row-right">
        <div class="dashadmin-card-section">
          <h3>Precificação</h3>
          <label>Preço</label>
          <div class="inputPrefix">
            <span>R$</span>
            <money v-model="product.price" maxlength="9" :keyup="productStatusAtt()" />
          </div>
          <label>Preço de comparação</label>
          <div class="inputPrefix">
            <span>R$</span>
            <money v-model="product.priceCompare" maxlength="9" />
          </div>
          <label>Custo</label>
          <div class="inputPrefix inputPrefix-obs">
            <span>R$</span>
            <money v-model="product.cost" maxlength="9" :keyup="productStatusAtt()" />
          </div>
          <span class="inputPrefix-obs-span">O cliente não verá isto.</span>

          <div class="profitMarginStatus">
            <div class="profitMarginStatus-divider">
              <label>Margem</label>
              <p>{{ productstatus.margin.toFixed(0) }} %</p>
            </div>
            <div class="profitMarginStatus-divider">
              <label>Lucro</label>
              <p>R$ {{ productstatus.profit.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</p>
            </div>
          </div>
        </div>

        <div class="dashadmin-card-section">
          <h3>Estoque</h3>
          <label>Quantidade</label>
          <input type="text" v-model="product.quantity" maxlength="5" />
          <label>Código de barras</label>
          <input type="text" v-model="product.barcode" maxlength="40" />
          <label>SKU</label>
          <input type="text" v-model="product.sku" maxlength="12" />
        </div>

        <div class="dashadmin-card-section">
          <h3>Envio</h3>
          <p>Usado para calcular os custos de envio.</p>
          <label>Peso</label>
          <div class="inputPrefix">
            <span>KG</span>
            <input type="text" v-model="product.weight" maxlength="4" />
          </div>
        </div>

        <div class="dashadmin-card-section">
          <h3>SEO</h3>
          <p>*Pendente*</p>
          <label>Categoria</label>
          <input type="text" v-model="product.type" disabled />
          <label>Fabricante</label>
          <input type="text" v-model="product.vendor" disabled />
        </div>
        <button v-if="!editingProduct" class="btn-first" @click="addProduct()">ADICIONAR PRODUTO</button>
        <button v-else class="btn-first" @click="updateProduct()">SALVAR ALTERAÇÕES</button>
      </div>
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

    <div class="dashadmin-card-full" v-show="productList">
      <div class="dashadmin-card-full-header">
        <div class="dashadmin-card-section">
          <div class="dash-card-titlebtn">
            <h2>Produtos Cadastrados</h2>
            <button class="btn-first" @click="addProductModal=true; productList=false">ADICIONAR</button>
          </div>
        </div>
      </div>
      <div class="dashadmin-card-full-table">
        <table v-if="products.length">
          <thead>
            <tr>
              <th>Nome</th>
              <th style="width: 50px">Qtd.</th>
              <th style="width: 120px">Preço</th>
              <th style="width: 140px">Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>R$ {{ product.price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</td>
              <td>
                <button class="tbtn tbtn-second" @click="editProduct(product)">EDITAR</button>
                <span style="padding: 4px"></span>
                <button class="tbtn" @click="deletionModal=true; deletionProduct=product;">EXCLUIR</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="dashadmin-card-section dashadmin-product-empty">
            <div class="dashadmin-product-empty-card">
              <p
                style="margin-bottom: 0; font-size: 1.2rem;"
              >Você verá os produtos aqui quando adicionados.</p>
            </div>

            <button class="btn-first" @click="addProductModal=true; productList=false">ADICIONAR</button>
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
  name: "Products",
  data() {
    return {
      addProductModal: false,
      editingProduct: false,
      productList: true,

      deletionModal: false,
      deletionProduct: "",

      performingUpload: false,
      performingUploadMsg: "",
      performingUploadMsgShow: false,

      products: [],
      product: {
        name: "",
        description: "",
        image: [],
        price: 0,
        priceCompare: 0,
        cost: 0,
        quantity: "",
        barcode: "",
        sku: "",
        weight: "",
        type: null,
        vendor: null
      },
      productbkp: {},
      productstatus: {
        margin: 0,
        profit: 0
      },
      haveVariants: false,

      editingProductImg: false,
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
      if (this.performingUpload) {
        toast.createToast("Aguarde o envio das imagens!", false);
        return;
      }
      if (this.product.name == "") {
        window.scrollTo(0, 0);
        toast.createToast("Adicione um nome ao produto.", false);
        return;
      }
      loading.switch(true);
      this.$firestore.products
        .add(this.product)
        .then(() => {
          this.reset();
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Produto adicionado!");
        })
        .catch(function(error) {
          console.error("Erro adicionando documento: ", error);
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Erro enviando dados!", false);
        });
    },
    editProduct(product) {
      let { id, ...toeditproduct } = product;
      this.activeproduct = id;
      id = null;
      this.product = toeditproduct;
      if (Object.keys(this.product.image).length === 0) {
        this.editingProductImg = false;
      } else {
        this.editingProductImg = true;
      }
      this.addProductModal = true;
      this.editingProduct = true;
      this.productList = false;
    },
    updateProduct() {
      if (this.performingUpload) {
        toast.createToast("Aguarde o envio das imagens!", false);
        return;
      }
      loading.switch(true);
      this.$firestore.products
        .doc(this.activeproduct)
        .update(this.product)
        .then(() => {
          this.reset();
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Informações Atualizadas!");
          this.addProductModal = false;
          this.editingProduct = false;
          this.productList = true;
        })
        .catch(function(error) {
          console.error("Erro atualizando documento: ", error);
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Erro enviando dados!", false);
        });
    },
    uploadImage(e) {
      this.performingUpload = true;
      this.performingUploadMsgShow = true;
      this.performingUploadMsg = "Enviando imagem, aguarde...";
      if (e.target.files[0]) {
        let file = e.target.files[0];
        var storageRef = firebase.storage.ref("products/" + file.name);
        let uploadTask = storageRef.put(file);

        uploadTask.on(
          "state_changed",
          () => {},
          error => {
            console.log("Erro enviando imagem: ", error);
            this.performingUpload = false;
            this.performingUploadMsg =
              "Ocorreu um erro ao enviar a imagem: " + error;
          },
          () => {
            var preview = document.getElementsByClassName(
              "imgInput-nopreview"
            )[0];
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.product.image.push(downloadURL);
            });
            this.performingUpload = false;
            this.performingUploadMsgShow = false;
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
          this.performingUploadMsgShow = true;
          this.performingUploadMsg = "Imagem deletada!";
        })
        .catch(function(error) {
          console.log("Erro deletando imagem: ", error);
          this.performingUploadMsgShow = true;
          this.performingUploadMsg = "Ocorreu um erro ao deletar a imagem!";
        });
    },
    deleteProduct(product) {
      loading.switch(true);
      this.$firestore.products
        .doc(product.id)
        .delete()
        .then(() => {
          this.deletionModal = false;
          this.deletionProduct = "";
          loading.switch(false);
          toast.createToast("Produto deletado!");
        })
        .catch(function(error) {
          console.log("Erro deletando produto: ", error);
          this.deletionModal = false;
          this.deletionProduct = "";
          loading.switch(false);
          toast.createToast("Erro deletando produto!", false);
        });
    },
    reset() {
      this.product = Object.assign({}, this.productbkp);
      this.activeproduct = null;
      this.editingProductImg = false;
    },
    productStatusAtt() {
      this.productstatus.profit = this.product.price - this.product.cost;
      if (this.productstatus.profit == 0) {
        this.productstatus.margin = 0;
      } else {
        this.productstatus.margin =
          (this.productstatus.profit / this.product.price) * 100;
      }
    }
  },
  created() {
    this.productbkp = Object.assign({}, this.product);
  }
};
</script>

<style>
/* ======================================================================== */
/* Product List */

.dashadmin-card-full {
  display: grid;
  grid:
    "dashadmin-card-full-header" 100px
    "dashadmin-card-full-table" 100%
    / 100%;
}

.dashadmin-card-full-header {
  grid-area: dashadmin-card-full-header;
}

.dashadmin-card-full-table {
  grid-area: dashadmin-card-full-table;
}

.dashadmin-product-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashadmin-product-empty-card {
  width: 100%;
  height: 100px;
  background: #36393f;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

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

.dashadmin-card-section p {
  font-size: 0.95rem;
}

.dashadmin-card-section > :last-child {
  margin-bottom: 0;
}

.profitMarginStatus {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.profitMarginStatus-divider {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profitMarginStatus-divider p {
  font-size: 1rem;
  margin: 0;
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
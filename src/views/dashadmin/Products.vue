<template>
  <div class="cproducts">
    <h1>Produtos</h1>
    <p>Aqui você pode gerenciar os produtos cadastrados e cadastrar novos produtos.</p>
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
              @click="addProductModal=false; productList=true; editingProduct = false; reset(); deleteNotComfirmedImages();"
            >CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="dashadmin-card-2row-left">
        <div v-if="editingProduct" class="dashadmin-card-section">
          <label>Código do Produto</label>
          <div class="editingProduct-idanddelete">
            <input type="text" v-model="activeproduct" disabled />
            <button @click="deletionModal=true; deletionProduct=product;">DELETAR PRODUTO</button>
          </div>
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
            <button
              id="imginputbutton"
              class="btn-first btn-inputfile"
              @click="$refs.imgInput.click()"
            >
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
            <p>Este produto possui variações</p>
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
          <div class="inputPrefix input-obs">
            <span>R$</span>
            <money v-model="product.cost" maxlength="9" :keyup="productStatusAtt()" />
          </div>
          <span class="input-obs-span">O cliente não verá isto.</span>

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

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Deletion Modal -->

    <transition name="fade">
      <div v-if="deletionModal" class="dashadmin-deletionpage">
        <div class="dashadmin-deletionmodal">
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
          <div class="dashadmin-card-section dashadmin-table-empty">
            <div class="dashadmin-table-empty-card">
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
      notComfirmedImages: [],

      editingProductImg: false,
      activeproduct: ""
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
          this.notComfirmedImages = [];
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
      this.product = Object.assign(this.product, toeditproduct);
      if (Object.keys(this.product.image).length === 0) {
        this.editingProductImg = false;
      } else {
        this.editingProductImg = true;
      }
      this.performingUploadMsgShow = false;
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
          this.notComfirmedImages = [];
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Informações Atualizadas!");
          this.addProductModal = false;
          this.editingProduct = false;
          this.productList = true;
        })
        .catch(function(error) {
          console.error("Erro atualizando produto: ", error);
          window.scrollTo(0, 0);
          loading.switch(false);
          toast.createToast("Erro enviando dados!", false);
        });
    },
    uploadImage(e) {
      this.performingUpload = true;
      this.performingUploadMsgShow = true;
      this.performingUploadMsg = "Enviando imagem, aguarde...";
      document.getElementById("imginputbutton").disabled = true;
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
            document.getElementById("imginputbutton").disabled = false;
          },
          () => {
            var preview = document.getElementsByClassName(
              "imgInput-nopreview"
            )[0];
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.product.image.push(downloadURL);
              this.notComfirmedImages.push(downloadURL);
            });
            document.getElementById("imginputbutton").disabled = false;
            this.performingUpload = false;
            this.performingUploadMsgShow = false;
            if (preview) preview.classList.add("hidden");
          }
        );
      }
    },
    deleteNotComfirmedImages() {
      this.notComfirmedImages.forEach(element => {
        let image = firebase.storage.refFromURL(element);
        image.delete();
      });
      this.notComfirmedImages = [];
    },
    deleteImage(img, index) {
      let image = firebase.storage.refFromURL(img);
      this.product.image.splice(index, 1);
      this.notComfirmedImages = this.notComfirmedImages.filter(
        item => item !== img
      );
      image
        .delete()
        .then(() => {
          this.performingUploadMsgShow = true;
          this.editingProductImg = false;
          if (Object.keys(this.product.image).length === 0) {
            document
              .getElementsByClassName("imgInput-nopreview")[0]
              .classList.remove("hidden");
          }
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
      var delproductid = "";
      if (product.id) {
        delproductid = product.id;
      } else {
        delproductid = this.activeproduct;
      }
      this.$firestore.products
        .doc(delproductid)
        .delete()
        .then(() => {
          this.deletionModal = false;
          this.deletionProduct = "";
          this.addProductModal = false;
          this.editingProduct = false;
          this.productList = true;
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
      if (this.productstatus.profit == 0 || this.product.price == 0) {
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

.dashadmin-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashadmin-table-empty-card {
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

.editingProduct-idanddelete {
  display: flex;
  justify-content: space-between;
}

.editingProduct-idanddelete input {
  margin-bottom: 0;
  width: 100%;
  margin-right: 20px;
}
</style>
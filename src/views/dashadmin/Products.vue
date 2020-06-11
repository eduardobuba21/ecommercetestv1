<template>
  <div class="cproducts">
    <h1>Products</h1>
    <p>Products page.</p>
    <br />
    <br />
    <br />

    <h1>Create Product</h1>
    <div class="form">
      <input type="text" placeholder="Product name" v-model="product.name" />
      <input type="text" placeholder="Price" v-model="product.price" />
      <input type="file" @change="uploadImage" />
      <button @click="addProduct()">Add product</button>
    </div>

    <div>
      <div v-for="(image, index) in product.image" :key="image.id">
        <div class="imgwrap">
          <img :src="image" width="80px" />
          <span @click="deleteImage(image, index)">X</span>
        </div>
      </div>
    </div>

    <br />
    <br />
    <h1>Edit Product</h1>
    <div class="form">
      <input type="text" placeholder="Product ID" v-model="activeproduct" disabled />
      <input type="text" placeholder="Product name" v-model="editedproduct.name" />
      <input type="text" placeholder="Price" v-model="editedproduct.price" />
      <button @click="updateProduct()">Update product</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Modify</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>
            <button @click="editProduct(product)">Edit</button>
            <button @click="deleteProduct(product)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Products",
  data() {
    return {
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
  padding: 50px;
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
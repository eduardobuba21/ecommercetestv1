<template>
  <div class="cproducts">
    <h1>Products</h1>
    <p>Products page.</p>
    <br />
    <br />
    <br />

    <p>Create Product</p>
    <div class="form">
      <input type="text" placeholder="Product name" v-model="product.name" />
      <input type="text" placeholder="Price" v-model="product.price" />
      <button @click="saveData">Save product</button>
    </div>

    <p>Edit Product</p>
    <div class="form">
      <input type="text" placeholder="Product ID" v-model="editproduct.id" disabled />
      <input type="text" placeholder="Product name" v-model="editproduct.name" />
      <input type="text" placeholder="Price" v-model="editproduct.price" />
      <button @click="updateData">Update product</button>
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
          <td>{{ product.data().name }}</td>
          <td>{{ product.data().price }}</td>
          <td>
            <button @click="editProduct(product)">Edit</button>
            <button @click="deleteProduct(product.id)">Delete</button>
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
        price: null
      },
      editproduct: {
        id: null,
        name: null,
        price: null
      }
    };
  },
  methods: {
    watcher() {
      firebase.productsCollection.onSnapshot(querySnapshot => {
        this.products = [];
        querySnapshot.forEach(doc => {
          this.products.push(doc);
        });
      });
    },
    readData() {
      firebase.productsCollection.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.products.push(doc);
        });
      });
    },
    saveData() {
      firebase.productsCollection
        .add(this.product)
        .then(this.resetData())
        .then(this.watcher())
        .catch(error => {
          console.log("Error adding document: ", error);
        });
    },
    updateData() {
      firebase.productsCollection
        .doc(this.editproduct.id)
        .update(this.editproduct)
        .then(this.watcher())
        .catch(error => {
          console.log("Error updating document: ", error);
        });
    },
    editProduct(prod) {
      this.editproduct = prod.data();
      this.editproduct.id = prod.id;
    },
    deleteProduct(prod) {
      if (confirm("Are you sure?")) {
        firebase.productsCollection
          .doc(prod)
          .delete()
          .then(this.watcher())
          .catch(error => {
            console.log("Error removing document: ", error);
          });
      }
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this));
    }
  },
  created() {
    this.readData();
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
</style>
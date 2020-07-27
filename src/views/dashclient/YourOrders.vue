<template>
  <div class="wrap-your-orders">
    <div v-if="myOrders" class="ords">
      <div v-for="order in myOrders" :key="order.id" class="your-orders">
        <div class="product-name"></div>
        <div class="order-value">{{order.total_paid_amount}}</div>
        <div class="date-created">{{order.date_created}}</div>
        <div class="order-payment-type">{{order.payment_type_id}}</div>
        <div class="order-status">{{order.status}}</div>
      </div>
    </div>
    <div v-else class="not-orders">
      <h2>Você ainda não tem pedidos cadastrados</h2>
    </div>
    <!-- <div class="ords">
      <div class="your-orders">
        <div class="product-name">oi</div>
        <div class="order-value">oi</div>
        <div class="date-created">oi</div>
        <div class="order-payment-type">oi</div>
        <div class="order-status">oi</div>
      </div>
    </div>-->
  </div>
</template>

<script>
const firebase = require("@/firebaseConfig.js");

export default {
  name: "YourOrders",
  data() {
    return {
      myOrders: [],
      clientOrders: [],
    };
  },
  methods: {
    loadOrders() {
      firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          this.clientOrders = Object.values(doc.data().orders);
          this.clientOrders.forEach((order) => {
            firebase.db
              .collection("orders")
              .doc(order.toString())
              .get()
              .then((doc) => {
                this.myOrders.push(doc.data());
              });
          });
        })
        .catch((error) => {
          console.error("Erro no get Orders: ", error);
        });
    },
  },
  created() {
    this.loadOrders();
  }
};
</script>

<style>
.wrap-your-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrap-your-orders .ords .your-orders {
  background-color: #1b2124;
  color: whitesmoke;
  width: 400px;
  height: 300px;
  border-radius: 20px;
  padding: 30px;
  margin: 30px;
  display: grid;
  grid-template-rows: 20% 20% 20% 20% 20%;
  grid-template-areas:
    "product-name"
    "order-value"
    "date-created"
    "order-payment-type"
    "order-status";
}

.wrap-your-orders .ords .your-orders .product-name {
  grid-area: product-name;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-your-orders .ords .your-orders .order-value {
  grid-area: order-value;
  border-top: 1px solid whitesmoke;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.wrap-your-orders .ords .your-orders .date-created {
  grid-area: date-created;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-your-orders .ords .your-orders .order-payment-type {
  grid-area: order-payment-type;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-your-orders .ords .your-orders .order-status {
  grid-area: order-status;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wrap-your-orders .ords .your-orders .options button {
  margin: 5px;
}
</style>
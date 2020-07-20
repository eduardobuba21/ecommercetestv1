<template>
  <div class="checkout">
    <Navbar />

    <transition name="fade">
      <div id="loadingzone" class="loadingpage hidden">
        <div class="loadingcircle"></div>
      </div>
    </transition>

    <!-- ======================================================================================================== -->
    <!-- ======================================================================================================== -->
    <!-- Cart List -->
    <div class="checkoutcontainer">
      <div class="checkoutleft">
        <h1>Checkout page</h1>
        <div class="cart-products">
          <div v-for="product in this.cartproducts" :key="product.id">
            <div class="cart-products-item">
              <img class="cart-products-item-img" :src="product.image" />
              <h3 class="cart-products-item-tittle align-v">{{ product.name }}</h3>
              <div class="cart-products-item-quantity align-v">
                <svg @click="product.quantity --; cartSubTotalCalc()">
                  <use xlink:href="@/assets/icons.svg#minus" />
                </svg>
                <input class="quantity" v-model="product.quantity " />
                <svg @click="product.quantity ++; cartSubTotalCalc()">
                  <use xlink:href="@/assets/icons.svg#plus" />
                </svg>
              </div>
              <h3
                class="cart-products-item-price align-v"
              >R$ {{ product.price.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</h3>
              <span
                class="cart-products-item-remove align-v justify-end"
                @click="removeFromCheckout(product)"
              >
                <svg>
                  <use xlink:href="@/assets/icons.svg#close" />
                </svg>
              </span>
            </div>
            <hr />
          </div>
        </div>
        <!-- <div class="p-cards">
          <div class="card" v-for="product in this.cartproducts" :key="product.id">
            <img class="card-img" :src="product.image" />
            <h3 class="card-title">{{ product.name }}</h3>
            <h3 class="card-price">R$ {{ product.price }}</h3>
            <buy :productId="product.id"></buy>
            <span @click="removeFromCheckout(product)">X</span>
          </div>
        </div>-->
      </div>

      <!-- ======================================================================================================== -->
      <!-- ======================================================================================================== -->
      <!-- Cart Cost Information -->
      <div class="checkoutright">
        <div class="cart-info" v-show="!paymentSwitch">
          <h3>Subtotal</h3>
          <p>R$ {{ cartSubTotal.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</p>
          <hr />
          <h3>Frete</h3>
          <the-mask :mask="'#####-###'" :masked="false" v-model="postcode" />
          <button @click="correiosGetShippingInfo()">Calcular</button>
          <div v-show="shipping">
            <p>Preço: R$ {{ shippingCost.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</p>
            <p>Prazo: {{ shippingDeliveryDays }} dias uteis.</p>
          </div>
          <hr />
          <h2>Total</h2>
          <h3>R$ {{ cartTotal.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</h3>
          <hr />
          <button
            @click="paymentSwitch = !paymentSwitch; checkoutForm.transaction_amount = cartTotal"
          >Pagamento</button>
        </div>

        <!-- ======================================================================================================== -->
        <!-- ======================================================================================================== -->
        <!-- Payment Form -->
        <div v-show="paymentSwitch">
          <form id="pay" name="pay">
            <fieldset>
              <p>
                <label for="transaction_amount">Valor a pagar</label>
                <input
                  name="transaction_amount"
                  id="transaction_amount"
                  v-model="checkoutForm.transaction_amount"
                />
              </p>
              <p>
                <label for="cardNumber">Número do cartão</label>
                <input
                  type="text"
                  id="cardNumber"
                  data-checkout="cardNumber"
                  onselectstart="return false"
                  onpaste="return false"
                  oncopy="return false"
                  oncut="return false"
                  ondrag="return false"
                  ondrop="return false"
                  autocomplete="off"
                  @keyup="checkoutGuessPaymentMethod()"
                  v-model="cardNumber"
                />
              </p>
              <p>
                <label for="cardholderName">Nome e sobrenome</label>
                <input type="text" id="cardholderName" data-checkout="cardholderName" />
              </p>
              <p>
                <label for="cardExpirationMonth">Mês de vencimento</label>
                <input
                  type="text"
                  id="cardExpirationMonth"
                  data-checkout="cardExpirationMonth"
                  onselectstart="return false"
                  onpaste="return false"
                  oncopy="return false"
                  oncut="return false"
                  ondrag="return false"
                  ondrop="return false"
                  autocomplete="off"
                />
              </p>
              <p>
                <label for="cardExpirationYear">Ano de vencimento</label>
                <input
                  type="text"
                  id="cardExpirationYear"
                  data-checkout="cardExpirationYear"
                  onselectstart="return false"
                  onpaste="return false"
                  oncopy="return false"
                  oncut="return false"
                  ondrag="return false"
                  ondrop="return false"
                  autocomplete="off"
                />
              </p>
              <p>
                <label for="securityCode">Código de segurança</label>
                <input
                  type="text"
                  id="securityCode"
                  data-checkout="securityCode"
                  onselectstart="return false"
                  onpaste="return false"
                  oncopy="return false"
                  oncut="return false"
                  ondrag="return false"
                  ondrop="return false"
                  autocomplete="off"
                />
              </p>
              <p>
                <label for="installments">Parcelas</label>
                <select
                  id="installments"
                  class="form-control"
                  name="installments"
                  v-model="checkoutForm.installments"
                ></select>
              </p>
              <p class="hidden">
                <label for="docType">Tipo de documento</label>
                <select id="docType" data-checkout="docType">
                  <option value="CPF">CPF</option>
                </select>
              </p>
              <p>
                <label for="docNumber">CPF</label>
                <input type="text" id="docNumber" data-checkout="docNumber" />
              </p>
              <p>
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" v-model="checkoutForm.email" />
              </p>
              <input
                type="hidden"
                name="payment_method_id"
                id="payment_method_id"
                v-model="checkoutForm.payment_method_id"
              />
            </fieldset>
          </form>
          <button @click="checkoutDoPayment()">PAGAR AQUI</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require("../firebaseConfig.js");
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

import loading from "@/assets/js/loading.js";

export default {
  name: "Checkout",
  components: {
    Navbar
  },
  data() {
    return {
      products: [],
      cartproducts: [],
      sessionId: "",

      postcode: "",
      shipping: false,
      shippingCost: 0,
      shippingDeliveryDays: 0,

      cartSubTotal: 0,
      cartTotal: 0,

      paymentSwitch: false,

      doSubmit: false,
      cardNumber: "",
      checkoutForm: {
        token: "",
        transaction_amount: 0,
        installments: 1,
        payment_method_id: "",
        email: ""
      }
    };
  },
  firestore() {
    return {
      products: firebase.productsCollection
    };
  },
  methods: {
    // Stripe
    // pay() {
    //   let cartdata = this.$store.state.cart.map(item => ({
    //     [item.productId]: item.quantity
    //   }));

    //   cartdata = Object.assign({}, ...cartdata);

    //   axios
    //     .get(
    //       "https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutSession",
    //       {
    //         params: {
    //           products: cartdata
    //         }
    //       }
    //     )
    // },
    removeFromCheckout(item) {
      this.$store.commit("removeFromCart", item);

      let index = this.cartproducts.indexOf(item);
      this.cartproducts.splice(index, 1);
    },
    cartSubTotalCalc() {
      this.cartSubTotal = 0;
      this.cartproducts.forEach(item => {
        this.cartSubTotal += item.price * item.quantity;
      });
      this.cartTotal = this.cartSubTotal + parseFloat(this.shippingCost);
    },
    checkoutInit() {
      window.Mercadopago.setPublishableKey(
        "TEST-4ae0f943-a6ef-4a3d-82b3-c4478da32d94"
      );

      // Completa os tipos de documentos (CPF ou CNPJ).
      window.Mercadopago.getIdentificationTypes();
    },
    checkoutProcessPayment() {
      axios
        .get(
          "https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutProcessPayment",
          {
            params: {
              client: firebase.auth.currentUser.uid,
              token: this.checkoutForm.token,
              transaction_amount: this.checkoutForm.transaction_amount,
              installments: this.checkoutForm.installments,
              payment_method_id: this.checkoutForm.payment_method_id,
              email: this.checkoutForm.email
            }
          }
        )
        .then(response => {
          console.log(
            "RESPOSTA DO PROCCESS PAYMENT: ",
            response.data.paymentdata
          );
        })
        .catch(error => {
          console.log("ERRO DO PROCESS PAYMENT: ", error);
        });
      loading.switch(false);
    },
    checkoutDoPayment() {
      if (!this.doSubmit) {
        loading.switch(true);
        var $form = document.querySelector("#pay");
        window.Mercadopago.createToken($form, (status, response) => {
          if (status != 200 && status != 201) {
            loading.switch(false);
            alert("Verifique os dados inseridos!");
          } else {
            this.checkoutForm.token = response.id;
            this.doSubmit = true;
            this.checkoutProcessPayment();
          }
        });
        return false;
      }
    },
    checkoutGuessPaymentMethod() {
      let cardnumber = this.cardNumber;
      if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0, 6);
        window.Mercadopago.getPaymentMethod(
          {
            bin: bin
          },
          (status, response) => {
            if (status == 200) {
              this.checkoutForm.payment_method_id = response[0].id;
              this.checkoutGetInstallments();
            } else {
              alert(`Falha obtendo tipo do cartão: ${response}`);
            }
          }
        );
      }
    },
    checkoutGetInstallments() {
      window.Mercadopago.getInstallments(
        {
          payment_method_id: this.checkoutForm.payment_method_id,
          amount: parseFloat(this.checkoutForm.transaction_amount)
        },
        function(status, response) {
          if (status == 200) {
            document.getElementById("installments").options.length = 0;
            response[0].payer_costs.forEach(installment => {
              let opt = document.createElement("option");
              opt.text = installment.recommended_message;
              opt.value = installment.installments;
              document.getElementById("installments").appendChild(opt);
            });
          } else {
            alert(`Falha obtendo parcelas: ${response}`);
          }
        }
      );
    },
    correiosGetShippingInfo() {
      loading.switch(true);
      axios
        .get(
          "https://us-central1-southpine-ecommerce.cloudfunctions.net/correiosGetShippingInfo",
          {
            params: {
              sCepDestino: this.postcode
            }
          }
        )
        .then(response => {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(
            response.data.shippinginfo,
            "text/xml"
          );

          this.shippingCost = xmlDoc
            .getElementsByTagName("Valor")[0]
            .childNodes[0].nodeValue.replace(",", ".");
          this.shippingDeliveryDays = xmlDoc.getElementsByTagName(
            "PrazoEntrega"
          )[0].childNodes[0].nodeValue;
          this.shipping = true;
          this.cartSubTotalCalc();
          loading.switch(false);
        })
        .catch(error => {
          console.log("ERRO DO GET SHIPPING INFO ", error);
          loading.switch(false);
        });
    }
  },
  created() {
    this.$store.state.cart.forEach(item => {
      var docRef = firebase.productsCollection.doc(item.productId);
      docRef.get().then(doc => {
        let productinfo = {};
        productinfo.productId = item.productId;
        productinfo.name = doc.data().name;
        productinfo.price = doc.data().price;
        productinfo.image = doc.data().image;
        productinfo.quantity = item.quantity;
        this.cartproducts.push(productinfo);
        this.cartSubTotalCalc();
      });
    });
  },
  mounted() {
    this.checkoutInit();
  }
};
</script>

<style>
.checkoutcontainer {
  display: grid;
  grid:
    "checkoutleft checkoutright" 40vh
    "checkoutleft checkoutright" 40vh
    / 70% 30%;
  padding: 60px 100px;
}

.checkoutleft {
  grid-area: checkoutleft;
  padding-right: 50px;
}

.checkoutright {
  grid-area: checkoutright;
}

.cart-products hr {
  margin: 20px 0;
}

.cart-products-item {
  display: grid;
  grid:
    "cart-products-item-img cart-products-item-tittle cart-products-item-quantity cart-products-item-price cart-products-item-remove" 150px
    / 20% 40% 20% 15% 5%;
}

.align-v {
  display: flex;
  align-items: center;
}

.justify-end {
  justify-content: flex-end;
}

.cart-products-item-img {
  grid-area: cart-products-item-img;
  width: 120px;
  border-radius: 10px;
  margin: auto 0;
}

.cart-products-item-tittle {
  grid-area: cart-products-item-tittle;
  align-content: center;
  margin: 0;
}

.cart-products-item-quantity {
  grid-area: cart-products-item-quantity;
}

.cart-products-item-quantity input {
  margin: 0;
  width: 8px;
  margin: 0 10px;
}

.cart-products-item-quantity svg {
  width: 15px;
  fill: white;
  cursor: pointer;
}

.cart-products-item-price {
  grid-area: cart-products-item-price;
  margin: 0;
}

.cart-products-item-remove {
  grid-area: cart-products-item-remove;
  cursor: pointer;
}

.cart-products-item-remove svg {
  width: 20px;
  fill: white;
}

.cart-info {
  width: 100%;
  border-radius: 10px;
  background-color: #303339;
  padding: 40px;
}
</style>
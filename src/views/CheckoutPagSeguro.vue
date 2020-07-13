<template>
  <div class="checkout"></div>
</template>

<script>
import axios from "axios";
// const firebase = require("@/firebaseConfig.js");
let PagSeguroDirectPayment = window.PagSeguroDirectPayment;

export default {
  name: "Checkout",
  data() {
    return {
      checkout: {
        session: ""
      }
    };
  },
  methods: {
    checkoutCreateSession() {
      axios
        .get(
          "https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutCreateSession"
        )
        .then(response => {
          if (response.data.status == "error") {
            console.error(
              "Erro criando sessão de checkout (servidor): ",
              response.data.message
            );
          } else {
            var domParser = new DOMParser();
            var xmlDoc = domParser.parseFromString(
              response.data.session,
              "text/xml"
            );
            this.checkout.session = xmlDoc.getElementsByTagName(
              "id"
            )[0].childNodes[0].nodeValue;
          }
        })
        .catch(error => {
          console.error("Erro criando sessão de checkout: ", error);
        });
    },
    checkoutGetPaymentMethods() {
      axios
        .get(
          "https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutGetPaymentMethods",
          {
            params: {
              session: this.checkout.session
            }
          }
        )
        .then(response => {
          console.log("MÉTODOS: ", response);
        })
        .catch(error => {
          console.log("ERRO, ", error);
        });
    }
  },
  mounted() {
    this.checkoutCreateSession();

    PagSeguroDirectPayment.setSessionId(this.checkout.session);

    // this.checkoutGetPaymentMethods();

    PagSeguroDirectPayment.getPaymentMethods({
      amount: 500.0,
      success: function(response) {
        // Retorna os meios de pagamento disponíveis.
        console.log("SUCCESS: ", response);
      },
      error: function(response) {
        // Callback para chamadas que falharam.
        console.log("ERROR: ", response);
      },
      complete: function(response) {
        // Callback para todas chamadas.
        console.log("COMPLETE: ", response);
      }
    });

    // setTimeout(() => {
    //   PagSeguroDirectPayment.onSenderHashReady(function(response) {
    //     if (response.status == "error") {
    //       console.log(response.message);
    //       return false;
    //     }
    //     var hash = response.senderHash; //Hash estará disponível nesta variável.
    //     console.log(hash);
    //   });
    // }, 3000);

    // // Identificador com os dados do comprador baseado naquela determinada sessão.
    // //
    // // O método onSenderHashReady possui algumas dependências, por isso,
    // // recomendamos que o mesmo não seja executado no onLoad da página ou mesmo onClick no evento "Finalizar Compra".
    // // Você pode executá-lo, por exemplo, no momento em que o cliente seleciona o campo destinado ao "Nome completo do comprador".
    // PagSeguroDirectPayment.onSenderHashReady(function(response) {
    //   if (response.status == "error") {
    //     console.log(response.message);
    //     return false;
    //   }
    //   var hash = response.senderHash; //Hash estará disponível nesta variável.
    //   console.log(hash);
    // });
    //
    //

    // PagSeguroDirectPayment.getBrand({
    //   cardBin: 411111,
    //   success: function(response) {
    //     //bandeira encontrada
    //     console.log("BANDEIRA ENCONTRADA: ", response);
    //   },
    //   error: function(response) {
    //     //tratamento do erro
    //     console.log("BANDEIRA NÃO ENCONTRADA: ", response);
    //   },
    //   complete: function(response) {
    //     //tratamento comum para todas chamadas
    //     console.log("BANDEIRA ENCONTRADA COMPLETE: ", response);
    //   }
    // });

    // // Só é necessário para pagamento com cartão de crédito!
    // PagSeguroDirectPayment.getBrand({
    //   cardBin: 411111, // BIN = 6 primeiros digitos do cartão.
    //   success: function(response) {
    //     //bandeira encontrada
    //     console.log(response);
    //   },
    //   error: function(response) {
    //     //tratamento do erro
    //     console.log(response);
    //   },
    //   complete: function(response) {
    //     //tratamento comum para todas chamadas
    //     console.log(response);
    //   }
    // });
    //
    //
    // // Só é necessário para pagamento com cartão de crédito!
    // //
    // // Obtem as possíveis parcelas.
    // PagSeguroDirectPayment.getInstallments({
    //   amount: 118.8,
    //   maxInstallmentNoInterest: 2, // Quantas parcelas sem juro a loja assume. (Mínimo 2) // Necessário alterar noInterestInstallmentQuantity também.
    //   brand: "visa",
    //   success: function(response) {
    //     // Retorna as opções de parcelamento disponíveis
    //     console.log(response);
    //   },
    //   error: function(response) {
    //     // callback para chamadas que falharam.
    //     console.log(response);
    //   },
    //   complete: function(response) {
    //     // Callback para todas chamadas.
    //     console.log(response);
    //   }
    // });
    // // Só é necessário para pagamento com cartão de crédito!
    // PagSeguroDirectPayment.createCardToken({
    //   cardNumber: "4111111111111111", // Número do cartão de crédito
    //   brand: "visa", // Bandeira do cartão
    //   cvv: "013", // CVV do cartão
    //   expirationMonth: "12", // Mês da expiração do cartão
    //   expirationYear: "2026", // Ano da expiração do cartão, é necessário os 4 dígitos.
    //   success: function(response) {
    //     // Retorna o cartão tokenizado.
    //     console.log(response);
    //   },
    //   error: function(response) {
    //     // Callback para chamadas que falharam.
    //     console.log(response);
    //   },
    //   complete: function(response) {
    //     // Callback para todas chamadas.
    //     console.log(response);
    //   }
    // });
  }
};
</script>

<style>
</style>
<template>
  <div class="checkout">
    <form id="pay" name="pay">
      <fieldset>
        <p>
          <label for="description">Descrição</label>
          <input type="text" name="description" id="description" value="Ítem selecionado" />
        </p>
        <p>
          <label for="transaction_amount">Valor a pagar</label>
          <input name="transaction_amount" id="transaction_amount" value="100" />
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
          <select id="installments" class="form-control" name="installments"></select>
        </p>
        <p class="hidden">
          <label for="docType">Tipo de documento</label>
          <select id="docType" data-checkout="docType">
            <option value="CPF">CPF</option>
            <!-- <option value="CNPJ">CNPJ</option> -->
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
</template>

<script>
import axios from "axios";
// const firebase = require("@/firebaseConfig.js");

export default {
  name: "Checkout",
  data() {
    return {
      doSubmit: false,
      cardNumber: "",
      checkoutForm: {
        token: "",
        transaction_amount: 100,
        installments: 1,
        payment_method_id: "",
        email: ""
      }
    };
  },
  methods: {
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
    },
    checkoutDoPayment() {
      if (!this.doSubmit) {
        var $form = document.querySelector("#pay");
        window.Mercadopago.createToken($form, (status, response) => {
          if (status != 200 && status != 201) {
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
    }
  },
  mounted() {
    this.checkoutInit();
  }
};
</script>

<style>
</style>
<template>
  <div class="checkout">
    <form
      action="https://us-central1-southpine-ecommerce.cloudfunctions.net/checkoutCreateSessionMP"
      method="post"
      id="pay"
      name="pay"
    >
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
        <p>
          <label for="docType">Tipo de documento</label>
          <select id="docType" data-checkout="docType"></select>
        </p>
        <p>
          <label for="docNumber">Número do documento</label>
          <input type="text" id="docNumber" data-checkout="docNumber" />
        </p>
        <p>
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" value="test@test.com" />
        </p>
        <input type="hidden" name="payment_method_id" id="payment_method_id" />
        <input type="submit" value="Pagar" />
      </fieldset>
    </form>
  </div>
</template>

<script>
// import axios from "axios";
// const firebase = require("@/firebaseConfig.js");
// let PagSeguroDirectPayment = window.PagSeguroDirectPayment;

export default {
  name: "Checkout",
  data() {
    return {
      checkout: {
        session: ""
      }
    };
  },
  methods: {},
  mounted() {
    window.Mercadopago.setPublishableKey(
      "TEST-4ae0f943-a6ef-4a3d-82b3-c4478da32d94"
    );

    // Completa os tipos de documentos (CPF ou CNPJ).
    window.Mercadopago.getIdentificationTypes();

    // Identifica o meio de pagamento com os primeiros 6 digitos do cartão.
    document
      .getElementById("cardNumber")
      .addEventListener("keyup", guessPaymentMethod);
    document
      .getElementById("cardNumber")
      .addEventListener("change", guessPaymentMethod);
    function guessPaymentMethod() {
      let cardnumber = document.getElementById("cardNumber").value;
      if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0, 6);
        window.Mercadopago.getPaymentMethod(
          {
            bin: bin
          },
          setPaymentMethod
        );
      }
    }
    function setPaymentMethod(status, response) {
      if (status == 200) {
        let paymentMethodId = response[0].id;
        let element = document.getElementById("payment_method_id");
        element.value = paymentMethodId;
        getInstallments();
      } else {
        alert(`payment method info error: ${response}`);
      }
    }

    // Obtém número de parcelas disponíveis e valores.
    function getInstallments() {
      window.Mercadopago.getInstallments(
        {
          payment_method_id: document.getElementById("payment_method_id").value,
          amount: parseFloat(
            document.getElementById("transaction_amount").value
          )
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
            alert(`installments method info error: ${response}`);
          }
        }
      );
    }

    // Cria o token do cartão.
    var doSubmit = false;
    document.querySelector("#pay").addEventListener("submit", doPay);
    function doPay(event) {
      event.preventDefault();
      if (!doSubmit) {
        var $form = document.querySelector("#pay");
        window.Mercadopago.createToken($form, sdkResponseHandler);
        return false;
      }
    }
    function sdkResponseHandler(status, response) {
      if (status != 200 && status != 201) {
        alert("verify filled data");
      } else {
        var form = document.querySelector("#pay");
        var card = document.createElement("input");
        card.setAttribute("name", "token");
        card.setAttribute("type", "hidden");
        card.setAttribute("value", response.id);
        form.appendChild(card);
        doSubmit = true;
        form.submit();
      }
    }
  }
};
</script>

<style>
</style>
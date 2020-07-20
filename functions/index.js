const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore()

const cors = require('cors')({ origin: true });
const axios = require('axios');


// ======================================================================================================== //
// Change User CustomClaims to add/remove admins.
//
exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!(context.auth.token.role === "admin")) return
  try {
    var _ = await firebaseAdmin.auth().setCustomUserClaims(data.uid, data.customClaims)
    db.collection("users").doc(data.uid).update({
      customClaims: data.customClaims
    })
    return
  } catch (error) {
    console.log(error)
  }
});


// ======================================================================================================== //
// Get user email based on user id.
//
exports.getUserEmail = functions.https.onCall((data, context) => {
  if (!(context.auth.token.role === "admin")) return { status: 'error', code: 401, message: 'Não autorizado!' }
  var usermail = firebaseAdmin.auth().getUser(data.uid)
    .then(userRecord => {
      return userRecord.toJSON().email
    })
    .catch(error => reject({ status: 'error', code: 500, error }))
  return usermail
});


// ======================================================================================================== //
// Get shipping info of a product.
//
exports.correiosGetShippingInfo = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    axios
      .get("https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx", {
        params: {
          nCdEmpresa: "",
          sDsSenha: "",
          sCepOrigem: "83860000",
          sCepDestino: request.query.sCepDestino,
          nVlPeso: "1",
          nCdFormato: "1",
          nVlComprimento: "20",
          nVlAltura: "20",
          nVlLargura: "20",
          sCdMaoPropria: "n",
          nVlValorDeclarado: "200",
          sCdAvisoRecebimento: "n",
          nCdServico: "40010",
          nVlDiametro: "0",
          StrRetorno: "xml",
          nIndicaCalculo: "3"
        }
      })
      .then(shippingdata => {
        response.status(200).send({ shippinginfo: shippingdata.data });
        return;
      })
      .catch(error => {
        response.status(500).send({ message: error });
        console.log("ERRO DO GET SHIPPING INFO (CORREIOS): ", error);
        return;
      });
  })
});


// ======================================================================================================== //
// ======================================================================================================== //
// MercadoPago
//
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("TEST-8225314812382308-030318-ab20ea2c70039ee61ddce20be9e5dfe2-295016640");

// ================================================= //
// Process the payment.
//
exports.checkoutProcessPayment = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    var payment_data = {
      token: request.query.token,
      transaction_amount: parseFloat(request.query.transaction_amount),
      installments: parseInt(request.query.installments),
      payment_method_id: request.query.payment_method_id,
      payer: {
        email: request.query.email
      }
      // Armazenar shipping e coupuns e verificar outros!
    };
    mercadopago.payment.save(payment_data).then((paymentdata) => {
      var tosavedata = {
        client: request.query.client,
        date_created: paymentdata.body.date_created,
        date_approved: paymentdata.body.date_approved,
        payment_type_id: paymentdata.body.payment_type_id,
        coupon_amount: paymentdata.body.coupon_amount,
        shipping_amount: paymentdata.body.shipping_amount,
        transaction_amount: paymentdata.body.transaction_amount,
        total_paid_amount: paymentdata.body.transaction_details.total_paid_amount,
        net_received_amount: paymentdata.body.transaction_details.net_received_amount,
        status: paymentdata.body.status,
        status_detail: paymentdata.body.status_detail,
      };
      db.collection('orders').doc(paymentdata.body.id.toString()).set(tosavedata);
      var paydata = {
        id: paymentdata.body.id,
        status: paymentdata.body.status,
        status_detail: paymentdata.body.status_detail
      };
      response.status(200).send({ paymentdata: paydata });
      return;
    }).catch((error) => {
      console.log("ERRO EFETUANDO PAGAMENTO: ", error);
      response.status(500).send({ message: error });
      return;
    });
  })
});

// ================================================= //
// Payment notifications.
//
exports.payment_notification = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    response.status(200).send();
    // console.log("REQUEST QUERY: ", request.query);
    // { 'data.id': '28142667', type: 'payment' } 

    axios
      .get("https://api.mercadopago.com/v1/payments/" + request.query['data.id'], {
        params: {
          access_token: "TEST-8225314812382308-030318-ab20ea2c70039ee61ddce20be9e5dfe2-295016640"
        }
      })
      .then(paymentdata => {
        var tosavedata = {
          date_created: paymentdata.data.date_created,
          date_approved: paymentdata.data.date_approved,
          payment_type_id: paymentdata.data.payment_type_id,
          coupon_amount: paymentdata.data.coupon_amount,
          shipping_amount: paymentdata.data.shipping_amount,
          transaction_amount: paymentdata.data.transaction_amount,
          total_paid_amount: paymentdata.data.transaction_details.total_paid_amount,
          net_received_amount: paymentdata.data.transaction_details.net_received_amount,
          status: paymentdata.data.status,
          status_detail: paymentdata.data.status_detail,
        };
        db.collection('orders').doc(paymentdata.data.id.toString()).set(tosavedata);

        // db.collection('cities').doc('SF').get()
        //   .then(doc => {
        //     if (!doc.exists) {
        //       console.log('No such document!');
        //     } else {
        //       console.log('Document data:', doc.data());
        //     }
        //   })
        //   .catch(err => {
        //     console.log('Error getting document', err);
        //   });
        return;
      })
      .catch(error => {
        console.log("ERRO DO PAYMENT NOTIFICATION: ", error);
        return;
      });

    // {
    //   "id": 12345,
    //   "live_mode": true,
    //   "type": "payment",
    //   "date_created": "2015-03-25T10:04:58.396-04:00",
    //   "application_id": 123123123,
    //   "user_id": 44444, // Cópdigo do usuário.
    //   "version": 1,
    //   "api_version": "v1",
    //   "action": "payment.created", // ou payment.updated
    //   "data": {
    //       "id": "999999999" // Código do pagamento.
    //   }
    // }

    // Verificar se o id não é duplicado.
    // 5s para resposta!
  })
});


// ================================================= //
// HTTP response example.
//
// End the rensponse without data.
// res.end();
// res.status(404).end();


// const stripe = require('stripe')('sk_test_YY5qZzyUCzkftvLRbmIJjqPl00e7NdLwBT');

// exports.checkoutSession = functions.https.onRequest((request, response) => {
//   cors(request, response, async () => {
//     let myProducts = request.query.products;
//     myProducts = Object.entries(JSON.parse(myProducts));

//     const productsArray = [];
//     myProducts.forEach(item => {
//       const prod = firebaseAdmin.firestore().doc(`products/${item[0]}`).get();
//       productsArray.push(prod)
//     });

//     const all = await Promise.all(productsArray);

//     const results = [];

//     all.forEach(item => {
//       const data = {};
//       data.amount = parseFloat(item.data().price * 100);
//       data.currency = "aud";
//       data.name = item.data().name;

//       myProducts.forEach(q => {
//         if (item.id === q[0]) {
//           data.quantity = q[1];
//         }
//       });

//       results.push(data);
//     });

//     stripe.checkout.sessions.create(
//       {
//         success_url: 'https://example.com/success',
//         cancel_url: 'https://example.com/cancel',
//         payment_method_types: ['card'],
//         line_items: results
//       },
//       (err, session) => {
//         if (err) { console.log("Erro Stripe: ", err) }
//         response.send(session);
//       }
//     );
//   });
// });
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const db = firebaseAdmin.firestore()
firebaseAdmin.initializeApp();

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
    };
    mercadopago.payment.save(payment_data).then((data) => {
      response.status(200).send({ paymentdata: data });
      return;
    }).catch((error) => {
      console.log("ERRO EFETUANDO PAGAMENTO: ", error);
      response.status(500).send({ message: error });
    });

  })
  // Sending a OK status with data.
  // response.status(200).send({ test: "FUNÇÃO EXECUTADA" });

  // Sending a error message.
  // res.status(404).send('Sorry, we cannot find that!');
  // res.status(500).send({ error: 'something blew up' });

  // End the rensponse without data.
  // res.end();
  // res.status(404).end();
});



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
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp();
const stripe = require('stripe')('sk_test_YY5qZzyUCzkftvLRbmIJjqPl00e7NdLwBT');

const db = firebaseAdmin.firestore()


exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!(context.auth.token.role === "admin")) return
  try {
    var _ = await firebaseAdmin.auth().setCustomUserClaims(data.uid, data.customClaims)
    return db.collection("users").doc(data.uid).update({
      customClaims: data.customClaims
    })
  } catch (error) {
    console.log(error)
  }
});


exports.getUserEmail = functions.https.onCall((data, context) => {
  if (!(context.auth.token.role === "admin")) return { status: 'error', code: 401, message: 'Não autorizado!' }
  var usermail = firebaseAdmin.auth().getUser(data.uid)
    .then(userRecord => {
      return userRecord.toJSON().email
    })
    .catch(error => reject({ status: 'error', code: 500, error }))
  return usermail
});


exports.checkoutSession = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    let myProducts = request.query.products;
    myProducts = Object.entries(JSON.parse(myProducts));

    const productsArray = [];
    myProducts.forEach(item => {
      const prod = firebaseAdmin.firestore().doc(`products/${item[0]}`).get();
      productsArray.push(prod)
    });

    const all = await Promise.all(productsArray);

    const results = [];

    all.forEach(item => {
      const data = {};
      data.amount = parseFloat(item.data().price * 100);
      data.currency = "aud";
      data.name = item.data().name;

      myProducts.forEach(q => {
        if (item.id === q[0]) {
          data.quantity = q[1];
        }
      });

      results.push(data);
    });

    stripe.checkout.sessions.create(
      {
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: results
      },
      (err, session) => {
        if (err) { console.log("Erro Stripe: ", err) }
        response.send(session);
      }
    );
  });
});
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'
// import { user } from 'firebase-functions/lib/providers/auth'

const config = {
    apiKey: "AIzaSyCy5mFdis4yzfQj4Bzva_orS70xjn-vdh0",
    authDomain: "southpine-ecommerce.firebaseapp.com",
    databaseURL: "https://southpine-ecommerce.firebaseio.com",
    projectId: "southpine-ecommerce",
    storageBucket: "southpine-ecommerce.appspot.com",
    messagingSenderId: "831867880755",
    appId: "1:831867880755:web:00f3b1661f26516af9aa46"
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = firebase.auth().currentUser
const storage = firebase.storage()
const functions = firebase.functions()

// firebase collections
const usersCollection = db.collection('users')
//retornando apenas um usuário
const loggedUser = function() {
    let logged = {}
    for (let user in usersCollection) {
        if (currentUser.name === user.name) {
            logged = user
        } 
    }
    return logged
}
const productsCollection = db.collection('products')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    loggedUser,
    productsCollection,
    storage,
    functions
}
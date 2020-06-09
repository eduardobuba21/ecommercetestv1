import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'

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
const currentUser = auth.currentUser
const storage = firebase.storage()

// firebase collections
const usersCollection = db.collection('users')
const productsCollection = db.collection('products')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    productsCollection,
    storage
}
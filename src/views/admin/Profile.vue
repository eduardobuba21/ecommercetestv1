<template>
  <div class="profile">
    <h1>Profile</h1>
    <p>Profile page.</p>
    <br />
    <br />
    <br />

    <h1>Profile</h1>
    <div class="form">
      <input type="text" placeholder="Full name" v-model="profile.name" />
      <input type="text" placeholder="Phone" v-model="profile.phone" />
      <input type="text" placeholder="Address" v-model="profile.address" />
      <input type="text" placeholder="Postcode" v-model="profile.postcode" />
      <button @click="updateProfile()">Save</button>
    </div>

    <br />
    <br />
    <h1>Account</h1>
    <div class="form">
      <input type="text" placeholder="ID" v-model="account.id" disabled />
      <input type="text" placeholder="Email" v-model="account.email" disabled />
      <p v-if="account.emailVerified">Email verified!</p>
      <p v-else>Email not verified!</p>
      <button @click="resetPassword()">Reset password (email link)</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const firebase = require("@/firebaseConfig.js");

export default {
  name: "Profile",
  data() {
    return {
      profile: {
        name: null,
        phone: null,
        address: null,
        postcode: null
      },
      account: {
        id: null,
        email: null,
        emailVerified: null
      },
      temp: null
    };
  },
  firestore() {
    const user = firebase.auth.currentUser;
    this.account.id = user.uid;
    this.account.email = user.email;
    return {
      profile: firebase.usersCollection.doc(user.uid)
    };
  },
  methods: {
    resetPassword() {
      firebase.auth
        .sendPasswordResetEmail(firebase.auth.currentUser.email)
        .catch(error => {
          console.log("Error reseting password.", error);
        });
    },
    updateProfile() {
      let { id, ...toeditprofile } = this.profile;
      this.temp = id;
      id = null;

      this.$firestore.profile.update(toeditprofile);
    }
  },
  computed: {
    ...mapState(["userProfile"])
  }
};
</script>

<style>
</style>
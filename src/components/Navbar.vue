<template>
  <nav class="navbar">
    <router-link to="/" class="navlogo">
      <img src="@/assets/southpine/logotype-only.svg" />
    </router-link>

    <ul class="navlist">
      <li>
        <a>Notebooks</a>
      </li>
      <li>
        <a>Smartphones</a>
        <ul>
          <li>
            <a>Apple</a>
          </li>
          <li>
            <a>Samsung</a>
          </li>
        </ul>
      </li>
    </ul>

    <div class="navactions">
      <router-link to="/login">
        <img src="@/assets/user.png" />
      </router-link>
      <div v-if="userProfile.name" class="navuser">
        <p>Olá, {{ userProfile.name }}</p>
        <button @click="logout()">Sair</button>
      </div>
      <router-link to="/checkout">
        <img src="@/assets/bag.png" />
      </router-link>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
const firebase = require("../firebaseConfig.js");

export default {
  name: "Navbar",
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    logout() {
      firebase.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.navbar {
  background: #1e2124;
  height: 100px;
  padding: 0 10%;
  display: grid;
  grid:
    "navlogo navlist navlist navactions" 100%
    / 25% 25% 25% 25%;
}

.navlogo {
  grid-area: navlogo;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.navlogo img {
  width: 200px;
}

.navactions {
  grid-area: navactions;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.navactions img {
  width: 60px;
  margin-left: 30px;
}

.navlist {
  grid-area: navlist;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  padding: 0;
}

.navlist li {
  position: relative;
  list-style-type: none;
  width: 200px;
}

.navlist li ul {
  background: #1e2124;
  box-shadow: 6px 6px 30px 0px rgba(0, 0, 0, 0.3);
  border-radius: 10%;
  width: 100%;
  position: absolute;
  top: 70px;
  left: 0;
  padding: 10px 0 10px 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
  line-height: 35px;
}

.navlist li:hover ul,
.navlist li.over ul {
  visibility: visible;
  opacity: 1;
}

.navlist li ul li {
  display: flex;
  justify-content: center;
  width: 100%;
}

.navlist li ul li a {
  font-size: 1.1rem;
  padding: 0;
}

.navlist a {
  display: inline-block;
  font-size: 1.4rem;
  padding: 30px;
  transition: 0.3s;
}

.navlist a:hover {
  color: #ff7f14;
  transform: translate(0, -5px);
}

.navuser {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

.navuser p {
  margin-bottom: 5px;
}

.navuser button {
  padding: 5px;
}
</style>

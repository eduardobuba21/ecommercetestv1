<template>
  <div class="dash-admin-wrap" id="dash-admin-wrap">
    <div class="da-menu-wrap">
      <div class="da-profile">
        <div class="da-profile-img">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/southpine-ecommerce.appspot.com/o/users%2Fprofile.jpg?alt=media&token=ebe82d71-5762-442d-b253-1687b300874d"
          />
        </div>
        <p class="da-profile-name">{{ userProfile.name }}</p>
        <p class="da-profile-role">Administrador</p>
      </div>

      <ul class="da-nav">
        <li class="active nav01" v-on:click="navClick('nav01')">
          <router-link to="/dashadmin/overview">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#home" />
                </svg>
              </span>
              <span class="da-nav-item-title">Início</span>
            </div>
          </router-link>
        </li>
        <li class="nav02" v-on:click="navClick('nav02')">
          <router-link to="/dashadmin/orders">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#order" />
                </svg>
              </span>
              <span class="da-nav-item-title">Pedidos</span>
            </div>
          </router-link>
        </li>
        <li class="nav03" v-on:click="navClick('nav03')">
          <router-link to="/dashadmin/products">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#product" />
                </svg>
              </span>
              <span class="da-nav-item-title">Produtos</span>
            </div>
          </router-link>
        </li>
        <li class="nav04" v-on:click="navClick('nav04')">
          <router-link to="/dashadmin/clients">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#client" />
                </svg>
              </span>
              <span class="da-nav-item-title">Clientes</span>
            </div>
          </router-link>
        </li>
        <li class="nav05" v-on:click="navClick('nav05')">
          <router-link to="/dashadmin/discounts">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#discount" />
                </svg>
              </span>
              <span class="da-nav-item-title">Cupons</span>
            </div>
          </router-link>
        </li>
        <li class="nav06" v-on:click="navClick('nav06')">
          <router-link to="/dashadmin/help">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#help" />
                </svg>
              </span>
              <span class="da-nav-item-title">Ajuda</span>
            </div>
          </router-link>
        </li>
        <li class="nav07" v-on:click="navClick('nav07')">
          <router-link to="/dashadmin/settings">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#settings" />
                </svg>
              </span>
              <span class="da-nav-item-title">Configurações</span>
            </div>
          </router-link>
        </li>
        <li>
          <a href="#" @click="logout">
            <div class="da-nav-item">
              <span class="da-nav-item-icon">
                <svg>
                  <use xlink:href="@/assets/icons.svg#logout" />
                </svg>
              </span>
              <span class="da-nav-item-title">Logout</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div class="da-content-wrap">
      <div id="toastzone"></div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const firebase = require("../firebaseConfig.js");

export default {
  name: "DashAdmin",
  data() {
    return {
      name: null,
      toastCount: 0
    };
  },
  methods: {
    logout() {
      firebase.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    },
    navClick(navid) {
      var el = document.querySelector("." + navid);
      if (el.classList.contains("active")) {
        return;
      }

      [].forEach.call(document.querySelectorAll(".active"), function(el) {
        el.classList.remove("active");
      });

      // Seleciona o card que esta sendo clicado e o abre.
      el = document.querySelector("." + navid);
      el.classList.add("active");
    }
  },
  computed: {
    ...mapState(["userProfile"])
  }
};
</script>

<style>
.dash-admin-wrap {
  background-color: #1e2124;
  min-height: 100vh;
}

.da-menu-wrap {
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  background-color: #1e2124;
  box-shadow: 6px 6px 30px 0px #00000030;
}

.da-profile {
  text-align: center;
  padding-bottom: 20px;
}

.da-profile-img {
  padding: 30px 60px 10px 60px;
}

.da-profile-img img {
  width: 100%;
  border-radius: 50%;
}

.da-profile-name {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  margin: 0;
}

.da-profile-role {
  font-size: 0.9rem;
  margin: 0;
  color: #b9bbbe;
}

.da-nav {
  padding: 10px;
}

.da-nav .active svg {
  fill: #b9bbbe;
}

.da-nav .active .da-nav-item-title {
  color: #b9bbbe;
}

.da-nav .active {
  background-color: #282b30;
  border-radius: 8px;
}

.da-nav li:hover {
  background-color: #282b30;
  border-radius: 8px;
}

.da-nav-item {
  height: 40px;
  display: grid;
  grid:
    "da-nav-item-icon da-nav-item-title" 100%
    / 45px auto;
}

.da-nav-item-icon {
  grid-area: da-nav-item-icon;
  display: flex;
  justify-content: center;
  align-items: center;
}

.da-nav-item-icon svg {
  width: 25px;
  height: 25px;
  fill: #8e9297;
}

.da-nav-item:hover svg {
  fill: #b9bbbe;
}

.da-nav-item-title {
  grid-area: da-nav-item-title;
  display: flex;
  align-items: center;
  color: #8e9297;
}

.da-nav-item:hover .da-nav-item-title {
  color: #b9bbbe;
}

/* ======================================================================== */
/* Content */

.da-content-wrap {
  margin-left: 200px;
  padding: 50px;
}

.dash-card {
  background-color: #282b30;
  padding: 30px;
  border-radius: 10px;
}

.dash-card-titlebtn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.dash-admin-wrap h1 {
  font-family: "Roboto", sans-serif;
  font-size: 1.6rem;
}

.dash-admin-wrap h2 {
  font-size: 1.4rem;
}

.dash-admin-wrap p {
  color: #b9bbbe;
}
</style>
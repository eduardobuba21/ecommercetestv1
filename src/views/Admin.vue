<template>
  <div>
    <svg style="display:none;">
      <symbol id="pages" viewBox="0 0 16 16">
        <rect x="4" width="12" height="12" transform="translate(20 12) rotate(-180)" />
        <polygon points="2 14 2 2 0 2 0 14 0 16 2 16 14 16 14 14 2 14" />
      </symbol>
      <symbol id="options" viewBox="0 0 16 16">
        <path d="M8,11a3,3,0,1,1,3-3A3,3,0,0,1,8,11ZM8,6a2,2,0,1,0,2,2A2,2,0,0,0,8,6Z" />
        <path
          d="M8.5,16h-1A1.5,1.5,0,0,1,6,14.5v-.85a5.91,5.91,0,0,1-.58-.24l-.6.6A1.54,1.54,0,0,1,2.7,14L2,13.3a1.5,1.5,0,0,1,0-2.12l.6-.6A5.91,5.91,0,0,1,2.35,10H1.5A1.5,1.5,0,0,1,0,8.5v-1A1.5,1.5,0,0,1,1.5,6h.85a5.91,5.91,0,0,1,.24-.58L2,4.82A1.5,1.5,0,0,1,2,2.7L2.7,2A1.54,1.54,0,0,1,4.82,2l.6.6A5.91,5.91,0,0,1,6,2.35V1.5A1.5,1.5,0,0,1,7.5,0h1A1.5,1.5,0,0,1,10,1.5v.85a5.91,5.91,0,0,1,.58.24l.6-.6A1.54,1.54,0,0,1,13.3,2L14,2.7a1.5,1.5,0,0,1,0,2.12l-.6.6a5.91,5.91,0,0,1,.24.58h.85A1.5,1.5,0,0,1,16,7.5v1A1.5,1.5,0,0,1,14.5,10h-.85a5.91,5.91,0,0,1-.24.58l.6.6a1.5,1.5,0,0,1,0,2.12L13.3,14a1.54,1.54,0,0,1-2.12,0l-.6-.6a5.91,5.91,0,0,1-.58.24v.85A1.5,1.5,0,0,1,8.5,16ZM5.23,12.18l.33.18a4.94,4.94,0,0,0,1.07.44l.36.1V14.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V12.91l.36-.1a4.94,4.94,0,0,0,1.07-.44l.33-.18,1.12,1.12a.51.51,0,0,0,.71,0l.71-.71a.5.5,0,0,0,0-.71l-1.12-1.12.18-.33a4.94,4.94,0,0,0,.44-1.07l.1-.36H14.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H12.91l-.1-.36a4.94,4.94,0,0,0-.44-1.07l-.18-.33L13.3,4.11a.5.5,0,0,0,0-.71L12.6,2.7a.51.51,0,0,0-.71,0L10.77,3.82l-.33-.18a4.94,4.94,0,0,0-1.07-.44L9,3.09V1.5A.5.5,0,0,0,8.5,1h-1a.5.5,0,0,0-.5.5V3.09l-.36.1a4.94,4.94,0,0,0-1.07.44l-.33.18L4.11,2.7a.51.51,0,0,0-.71,0L2.7,3.4a.5.5,0,0,0,0,.71L3.82,5.23l-.18.33a4.94,4.94,0,0,0-.44,1.07L3.09,7H1.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H3.09l.1.36a4.94,4.94,0,0,0,.44,1.07l.18.33L2.7,11.89a.5.5,0,0,0,0,.71l.71.71a.51.51,0,0,0,.71,0Z"
        />
      </symbol>
      <symbol id="collection" viewBox="0 0 16 16">
        <rect width="7" height="7" />
        <rect y="9" width="7" height="7" />
        <rect x="9" width="7" height="7" />
        <rect x="9" y="9" width="7" height="7" />
      </symbol>
    </svg>

    <header class="page-header">
      <nav>
        <a href="#0">
          <img class="logo" src="@/assets/visualIdentity/southpine-logotype-horizontal.png" />
        </a>
        <button class="toggle-mob-menu" aria-expanded="false" aria-label="open menu">
          <svg width="20" height="20" aria-hidden="true">
            <use xlink:href="#down" />
          </svg>
        </button>
        <ul class="admin-menu">
          <li class="menu-heading">
            <h3>{{ userProfile.name }}</h3>
          </li>
          <li class="menu-heading">
            <h3>My orders</h3>
          </li>
          <li>
            <router-link to="/admin/overview">
              <svg>
                <use xlink:href="#pages" />
              </svg>
              <span>Overview</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/profile">
              <svg>
                <use xlink:href="#pages" />
              </svg>
              <span>Profile</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/products">
              <svg>
                <use xlink:href="#pages" />
              </svg>
              <span>Products</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/orders">
              <svg>
                <use xlink:href="#collection" />
              </svg>
              <span>Orders</span>
            </router-link>
          </li>
          <li class="menu-heading">
            <h3>Settings</h3>
          </li>
          <li>
            <router-link to="/admin/options">
              <svg>
                <use xlink:href="#options" />
              </svg>
              <span>Options</span>
            </router-link>
            <a href="#" @click="logout">
              <span>Log Out</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
    <section class="page-content">
      <router-view />
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
const firebase = require("../firebaseConfig.js");

export default {
  name: "admin",
  data() {
    return {
      name: null
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
    }
  },
  computed: {
    ...mapState(["userProfile"])
  }
};
</script>

<style>
:root {
  --page-header-bgColor: #212326;
  --page-header-bgColor-hover: #2a2b30;
  --page-header-txtColor: #ffffff98;
  --page-header-headingColor: #ffffff;
  --page-header-width: 220px;
  --page-content-bgColor: #2d3036;
  --page-content-txtColor: #fff;
  --page-content-blockColor: #1a1a27;
  --white: #fff;
  --black: #323232;
  --blue: #fff;
  --border-radius: 4px;
  --box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.075);
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

ul {
  list-style: none;
}

a,
button {
  color: inherit;
}

a {
  text-decoration: none;
}

button {
  background: none;
  cursor: pointer;
}

input {
  -webkit-appearance: none;
}

button,
input {
  border: none;
}

svg {
  display: block;
}

body {
  font-size: 16px/1.5;
}

/* HEADER STYLES
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding-top: 20px;
  width: var(--page-header-width);
  color: var(--page-header-txtColor);
  background: var(--page-header-bgColor);
}

.page-header nav {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.page-header .logo {
  display: block;
  max-width: 170px;
  margin: 0 20px;
}

.page-header .toggle-mob-menu svg {
  fill: var(--black);
  transition: transform 0.2s;
}

.page-header .admin-menu {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: -20px;
}

.page-header .admin-menu li > * {
  width: 100%;
  padding: 12px 15px;
}

.page-header .admin-menu .menu-heading h3 {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 12px;
  margin-top: 12px;
  color: var(--page-header-headingColor);
}

.page-header .admin-menu svg {
  width: 20px;
  height: 20px;
  fill: var(--page-header-txtColor);
  margin-right: 10px;
  transition: fill 0.2s;
}

.page-header .admin-menu a,
.page-header .admin-menu button {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: background 0.2s, color 0.2s;
}

.page-header .admin-menu a:hover,
.page-header .admin-menu a:focus,
.page-header .admin-menu button:hover,
.page-header .admin-menu button:focus {
  background: var(--page-header-bgColor-hover);
  color: var(--blue);
  outline: none;
}

.page-header .admin-menu a:hover svg,
.page-header .admin-menu a:focus svg,
.page-header .admin-menu button:hover svg,
.page-header .admin-menu button:focus svg {
  fill: var(--blue);
}

/* PAGE CONTENT STYLES
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.page-content {
  position: relative;
  left: var(--page-header-width);
  width: calc(100% - var(--page-header-width));
  min-height: 100vh;
  padding: 30px;
  color: var(--page-content-txtColor);
  background: var(--page-content-bgColor);
}

.page-content .grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
}

.page-content .grid > article {
  display: flex;
  height: 300px;
  background: var(--page-content-blockColor);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.page-content .grid > article:first-child,
.page-content .grid > article:last-child {
  grid-column: 1 / -1;
}

/* FOOTER
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.page-footer {
  font-size: 1rem;
  text-align: right;
  margin-top: 10px;
}

.page-footer span {
  color: var(--red);
}
</style>
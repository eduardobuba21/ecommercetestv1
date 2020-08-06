<template>
  <div class="wrap-dash-client">
    <Navbar />
    <div class="wrap-cards">
      <div class="container">
        <div class="card">
          <router-link to="/dashclient/yourorders">
            <div class="icon">
              <svg>
                <use xlink:href="@/assets/icons.svg#box" />
              </svg>
            </div>
            <div class="title">
              <p>Seus Pedidos</p>
            </div>
            <div class="description">
              <p>Rastrear, devolver ou comprar novamente.</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="container">
        <div class="card">
          <router-link to="/dashclient/personal">
            <div class="icon">
              <svg>
                <use xlink:href="@/assets/icons.svg#lock" />
              </svg>
            </div>
            <div class="title">
              <p>Acesso e Segurança</p>
            </div>
            <div class="description">
              <p>Alterar login, nome ou celular.</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="container">
        <div class="card">
          <router-link to="/dashclient/address">
            <div class="icon">
              <svg>
                <use xlink:href="@/assets/icons.svg#location" />
              </svg>
            </div>
            <div class="title">
              <p>Endereços</p>
            </div>
            <div class="description">
              <p>Alterar endereços para pedidos e presentes.</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="container">
        <div class="card">
          <router-link to="/dashclient/paymentdata">
            <div class="icon">
              <svg>
                <use xlink:href="@/assets/icons.svg#credit-card" />
              </svg>
            </div>
            <div class="title">
              <p>Seus Pagamentos</p>
            </div>
            <div class="description">
              <p>Gerenciar formas e configurações de pagamento.</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="dc-wrap-content">
      <div id="toastzone"></div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";

export default {
  name: "DashClient",
  methods: {},
  components: { Navbar },
};
</script>

<style>
.wrap-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 1px 1px 0px;
}

.wrap-cards .container {
  width: 400px;
  height: 200px;
  position: relative;
  display: flex;
  margin: 0 10px;
}
.wrap-cards .container .card {
  background-color: #1e2124;
  margin: 1px;
  padding: 10px;
  border-radius: 20px;
  font-family: "Montserrat", sans-serif;
  display: grid;
  width: 100%;
  grid-template-rows: 40% 20% 40%;
  grid-template-areas:
    "icon"
    "title"
    "desciption";
}

.wrap-cards .container .card svg {
  height: 45px;
  width: auto;
  fill: whitesmoke;
}

.wrap-cards .container .card:hover {
  background-color: #282b30;
  transition: 0.1s;
  box-sizing: border-box;
  box-shadow: 0 7px 9px rgba(0, 0, 0, 0.3);
}

.wrap-cards .container .card .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: icon;
}

.wrap-cards .container .card .title {
  display: flex;
  color: whitesmoke;
  grid-area: title;
  font-size: 1.2rem;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-cards .container .card .description {
  font-size: 0.9rem;
  font-weight: 100;
  grid-area: description;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dc-wrap-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px;
  padding: 20px;
}
</style>
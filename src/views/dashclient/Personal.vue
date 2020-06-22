<template>
  <div class="wrap-personal">
    <div class="wrap-fields">
      <div class="wrap-field">
        <div class="field">
          <p class="title">Nome</p>
          <p class="content">{{userProfile.name}}</p>
          <div class="btn-personal">
            <router-link to="/dashclient/personal/changename">
              <button class="btn-first">Editar</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="wrap-field">
        <div class="field">
          <p class="title">Email</p>
          <p class="content">{{currentUser.email}}</p>
          <div class="btn-personal">
            <router-link to="/dashclient/personal/changeemail">
              <button class="btn-first">Editar</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="wrap-field">
        <div class="field">
          <p class="title">Senha</p>
          <p class="content">********</p>
          <div class="btn-personal">
            <router-link to="/dashclient/personal/changepassword">
              <button class="btn-first">Editar</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="wrap-field">
        <div class="field">
          <p class="title">Telefone</p>
          <p class="content">{{userProfile.phone}}</p>
          <div class="btn-personal">
            <router-link to="/dashclient/personal/changephone">
              <button class="btn-first">Editar</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="changes">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Personal",
  computed: {
    ...mapGetters(["currentUser", "userProfile"])
  }
};
</script>

<style>
.wrap-personal {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-areas: "fields changes";
}

.wrap-personal .wrap-fields {
  grid-area: fields;
}

.wrap-personal .wrap-field {
  margin: 0;
}

.wrap-personal .wrap-field .field {
  width: 800px;
  height: 100px;
  border-radius: 20px;
  background-color: #1e2124;
  color: white;
  font-family: "Montserrat", sans-serif;
  margin: 20px;
  display: grid;
  grid-template-columns: 70% 30%;
  grid-template-rows: 40% 60%;
  grid-template-areas:
    "title btn"
    "content btn";
}

.wrap-personal .wrap-field .field:hover {
  background-color: #282b30;
  box-shadow: 0 7px 9px rgba(0, 0, 0, 0.3);
}

.wrap-personal .wrap-field .field .title {
  font-weight: 300;
  padding: 2px 0 0 30px;
  grid-area: title;
}

.wrap-personal .wrap-field .field .content {
  font-weight: 100;
  font-size: 0.8em;
  padding: 2px 0 0 30px;
  grid-area: content;
}

.wrap-personal .wrap-field .field .btn-personal {
  grid-area: btn;
  display: flex;
  padding-right: 30px;
  align-items: center;
  justify-content: flex-end;
}

.wrap-personal .wrap-field .cg-pass {
  width: 800px;
  height: 100px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #282b30;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .changes {
  grid-area: changes;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
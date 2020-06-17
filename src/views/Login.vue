<template>
  <div id="logincontainer">
    <transition name="fade">
      <div v-if="performingRequest" class="loadingpage">
        <div class="loadingcircle"></div>
      </div>
    </transition>

    <div id="formscontainer" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
      <transition name="fade">
        <form v-if="showLoginForm" @submit.prevent class="loginforms">
          <div class="loginformitems">
            <div class="logintittle">
              <h1>Boas-vindas de volta!</h1>
              <p>Estamos muito animados em te ver novamente!</p>
            </div>

            <div class="loginfield">
              <label for="email1">E-mail</label>
              <input v-model.trim="loginForm.email" type="text" id="email1" />
              <label for="password1">Senha</label>
              <input
                v-model.trim="loginForm.password"
                type="password"
                id="password1"
                @keyup.enter="login"
              />
            </div>

            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>

            <div class="loginbutton">
              <button @click="login" class="btn-first" style="width: 100%">Entrar</button>
            </div>

            <div class="loginextra">
              <a @click="togglePasswordReset">Esqueceu a senha?</a>
              <a @click="toggleForm">
                Não tem uma conta?
                <span style="color: #faa61a">Registre-se!</span>
              </a>
            </div>
          </div>
        </form>
      </transition>

      <transition name="fade">
        <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent class="loginforms">
          <div class="loginformitems">
            <div class="logintittle">
              <h1>Crie uma conta!</h1>
              <p>Todos os campos são obrigatórios.</p>
            </div>

            <div class="loginfield">
              <label for="name">Nome</label>
              <input v-model.trim="signupForm.name" type="text" id="name" />
              <label for="title">CPF</label>
              <input v-model.trim="signupForm.title" type="text" id="title" />
              <label for="email2">E-mail</label>
              <input v-model.trim="signupForm.email" type="text" id="email2" />
              <label for="password2">Senha</label>
              <input v-model.trim="signupForm.password" type="password" id="password2" />
            </div>

            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>

            <div class="loginbutton">
              <button @click="signup" class="btn-first" style="width: 100%">Continuar</button>
            </div>

            <div class="loginextra">
              <a @click="toggleForm">Já tem uma conta?</a>
            </div>
          </div>
        </form>
      </transition>

      <transition name="fade">
        <form v-if="showForgotPassword" @submit.prevent class="password-reset loginforms">
          <div v-if="!passwordResetSuccess">
            <div class="loginformitems">
              <div class="logintittle">
                <h1>Recupere sua senha!</h1>
                <p>Vamos lhe enviar um e-mail com os passos.</p>
              </div>

              <div class="loginfield">
                <label for="email3">E-mail</label>
                <input v-model.trim="passwordForm.email" type="text" id="email3" />
              </div>

              <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                  <p>{{ errorMsg }}</p>
                </div>
              </transition>

              <div class="loginbutton">
                <button @click="resetPassword" class="btn-first" style="width: 100%">Enviar</button>
              </div>

              <div class="loginextra">
                <a @click="togglePasswordReset">Voltar para o login</a>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="loginformitems">
              <div class="logintittle">
                <h1>E-mail enviado!</h1>
                <p>Verifique seu e-mail para recuperar sua senha.</p>
              </div>
              <div class="loginbutton">
                <button
                  @click="togglePasswordReset"
                  class="btn-first"
                  style="width: 100%"
                >Voltar para o login</button>
              </div>
            </div>
          </div>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
const firebase = require("../firebaseConfig.js");

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: ""
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
      }
    },
    login: async function() {
      this.performingRequest = true;
      try {
        const user = await firebase.auth.signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        );
        this.$store.commit("setCurrentUser", user.user);
        this.$store.dispatch("fetchUserProfile");
        this.performingRequest = false;
        this.$router.push("/dashadmin");
      } catch (err) {
        console.log(err);
        this.performingRequest = false;
        this.errorMsg = err.message;
      }
    },
    signup: async function() {
      this.performingRequest = true;
      try {
        const user = await firebase.auth.createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        );
        this.$store.commit("setCurrentUser", user.user);

        firebase.usersCollection
          .doc(user.user.uid)
          .set({
            name: this.signupForm.name,
            title: this.signupForm.title
          })
          .then(() => {
            this.$store.dispatch("fetchUserProfile");
            this.performingRequest = false;
            this.$router.push("/admin");
          })
          .catch(err => {
            console.log(err);
            this.performingRequest = false;
            this.errorMsg = err.message;
          });
      } catch (err) {
        console.log(err);
        this.performingRequest = false;
        this.errorMsg = err.message;
      }
    },
    resetPassword() {
      this.performingRequest = true;

      firebase.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>

<style>
#logincontainer {
  width: 100vw;
  height: 100vh;
  background-color: #1e2124;
}

#formscontainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginforms {
  position: fixed;
  width: 500px;
  border-radius: 10px;
  background-color: #36393f;
}

.loginformitems {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.logintittle {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logintittle h1 {
  font-family: "Roboto", sans-serif;
  font-size: 1.6rem;
}

.logintittle p {
  color: #b9bbbe;
}

.loginfield {
  display: flex;
  flex-direction: column;
}

.loginextra {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}

.loginextra a {
  margin-top: 10px;
  color: #b9bbbe;
  cursor: pointer;
}

.error-msg {
  color: #faa61a;
  margin-bottom: 10px;
}
</style>
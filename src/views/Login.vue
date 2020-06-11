<template>
  <div id="logincontainer">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <div class="loginforms" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
      <form v-if="showLoginForm" @submit.prevent>
        <div class="loginformitems">
          <div class="logintittle">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to login</p>
          </div>

          <div class="loginfield">
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="you@email.com"
              id="email1"
            />
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
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
            <button @click="login" class="btn-primary">Log in</button>
          </div>

          <div class="loginextra">
            <a @click="togglePasswordReset">Forgot password</a>
            <a @click="toggleForm" style="color: #ff7f14">Create an account</a>
          </div>
        </div>
      </form>

      <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
        <div class="loginformitems">
          <div class="logintittle">
            <h1>Get Started</h1>
            <p>All fields are required</p>
          </div>

          <div class="loginfield">
            <label for="name">Name</label>
            <input v-model.trim="signupForm.name" type="text" placeholder="Savvy Apps" id="name" />
            <label for="title">Title</label>
            <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="you@email.com"
              id="email2"
            />
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 characters"
              id="password2"
            />
          </div>

          <transition name="fade">
            <div v-if="errorMsg !== ''" class="error-msg">
              <p>{{ errorMsg }}</p>
            </div>
          </transition>

          <div class="loginbutton">
            <button @click="signup" class="btn-primary">Sign up</button>
          </div>

          <div class="loginextra">
            <a @click="toggleForm">Back to log in</a>
          </div>
        </div>
      </form>

      <form v-if="showForgotPassword" @submit.prevent class="password-reset">
        <div v-if="!passwordResetSucess">
          <div class="loginformitems">
            <div class="logintittle">
              <h1>Reset Password</h1>
              <p>We will send you an email to reset your password</p>
            </div>

            <div class="loginfield">
              <label for="email3">Email</label>
              <input
                v-model.trim="passwordForm.email"
                type="text"
                placeholder="you@rmail.com"
                id="email3"
              />
            </div>

            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>

            <div class="loginbutton">
              <button @click="resetPassword" class="btn-primary">Submit</button>
            </div>

            <div class="loginextra">
              <a @click="togglePasswordReset">Back to Login</a>
            </div>
          </div>
        </div>
        <div v-else>
          <h1>Email sent</h1>
          <p>Check your email for a link to reset your password</p>
          <button @click="togglePasswordReset" class="btn-primary">Back to Login</button>
        </div>
      </form>
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
      passwordResetSucess: false,
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
  height: 100vh;
  background-color: #212326;
  display: flex;
  justify-content: center;
  align-items: center;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.loginforms {
  width: 500px;
  border-radius: 10px;
  background-color: #2d3036;
}

.loginformitems {
  display: flex;
  flex-direction: column;
  padding: 50px;
}

.logintittle {
  margin-bottom: 30px;
}

.logintittle h1 {
  margin-bottom: 6px;
}

.loginfield {
  display: flex;
  flex-direction: column;
}

.loginfield input {
  border: none;
  border-bottom: solid #ff7f14 2px;
  margin-bottom: 30px;
  background: none;
  color: rgba(255, 255, 255, 0.555);
  height: 35px;
}

.loginextra {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}

.loginextra a {
  margin-top: 16px;
}

.error-msg {
  color: #ff7f14;
  margin-bottom: 10px;
}
</style>
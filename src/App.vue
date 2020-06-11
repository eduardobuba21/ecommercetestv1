<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
body {
  margin: 0;
  background: #1a1a27;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
}

/* Remove autocomplete style from inputs */
body:not(.user-is-tabbing) button:focus,
body:not(.user-is-tabbing) input:focus,
body:not(.user-is-tabbing) select:focus,
body:not(.user-is-tabbing) textarea:focus {
  outline: none;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: rgba(255, 255, 255, 0.555);
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: rgba(255, 255, 255, 0.555);
}

a {
  text-decoration: none;
  color: #fff;
}

h1 {
  font-family: "Montserrat", sans-serif;
}
</style>
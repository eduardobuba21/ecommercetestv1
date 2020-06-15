<template>
  <div class="wrap-personal">
      <div class="field">
        <p class="title">Nome</p>
        <p class="content">Luis Felipe</p>
        <div class="btn-personal">
          <button class="btn-primary">Edit</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "Personal"
}
</script>

<style>
.wrap-personal{
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrap-personal .field {
  width: 800px;
  height: 100px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #282b30;
  color: white;
  font-family: "Montserrat", sans-serif;
  margin: 20px;
  display: grid;
  grid-template-columns: 70% 30%;
  grid-template-rows: 40% 60%;
  grid-template-areas: "title btn"
                        "content btn";
}

.wrap-personal .field .title {
  font-weight: 300;
  padding: 2px 0 0 30px;
  grid-area: title;
}

.wrap-personal .field .content {
  font-weight: 100;
  font-size: 0.8em;
  padding: 2px 0 0 30px;
  grid-area: content;
}

.wrap-personal .field .btn-personal {
  grid-area: btn;
  display: flex;
  padding-right: 30px;
  align-items: center;
  justify-content: flex-end;
}
</style>
<template>
  <div class="template_container">
    <h1 class="title">{{title}}</h1>
    <p>{{text}}</p>
    <div class="images_wrapper">
      <img width="500" src="../images/logo-vuejs-min.png" alt="vueLogo">
      <span class="plus">+</span>
      <img width="300" src="../images/webpack-logo.png" alt="webpackLogo">
    </div>
    <modulesList></modulesList>
  </div>
</template>
<script lang="ts">
import modulesList from './ModulesList.vue'

export default {
  name: 'App',
  components: {
    modulesList
  },
  data() {
    return {
      title: 'This is Mega Vue build',
      text: 'With the build you can create big Single Page Application!',
    }
  }
}
</script>

<style lang="scss" scoped>
  .template_container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .title {
      color: green;
    }

    .images_wrapper {
      display: flex;
      align-items: center;
    }

    .plus {
      font-weight: 600;
      font-size: 24px;
    }
  }
</style>
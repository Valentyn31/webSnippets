<template>
  <h2 style="color: green;">The build includes:</h2>
  <ul class="list">
    <li v-for="module in modules" class="list_item">{{module}}</li>
  </ul>
</template>

<script lang="ts">
export default {
  name: 'modulesList',
  data () {
    return {
      modules: ['Vue 3', 'TypeScript', 'Babel', 'SCSS', 'WEBP', '']
    }
  }
}
</script>

<style lang="scss" scoped>
  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding: 0;
    li {
      margin: 3px;
      font-size: 20px;
    }
  }
</style>
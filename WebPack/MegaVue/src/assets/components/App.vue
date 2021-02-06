<template>
  <h1 class="hello">{{text}}</h1>
</template>
<script>
export default {
  name: 'hello',
  data() {
    return {
      text: 'Hello world'
    }
  }
}
</script>

<style lang="scss">
  .hello {
    color: green;  
  }  
</style>
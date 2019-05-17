<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

html,body,#app{
    height: 100%;
  }

  body{
    margin: 0;
  }

  #app{
        font-size: 16px;
  }

</style>

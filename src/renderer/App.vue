<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
    export default {
        name: 'cds_front_ui'
    }
</script>

<style>
  /* CSS */
  @import "assets/css/public.css";
</style>

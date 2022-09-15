<template>
  <div id="app">
    <Basic />
    <!-- 路由组件出口 -->
    <router-view></router-view>
    <!-- <router-view v-if="$route.meta.isShow"></router-view> -->
    <Player />
  </div>
</template>

<script>
import Player from "@/components/Player/Player";
import Basic from "@/components/Basic/Basic";
export default {
  name: "App",
  components: {
    Basic,
    Player,
  },
};
</script>

<style>
</style>

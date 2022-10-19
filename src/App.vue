<template>
  <div id="app">
    <Basic />
    <!-- 缓存组件频繁点击 -->
    <keep-alive>
      <!-- 路由组件出口 -->
      <router-view></router-view>
    </keep-alive>
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

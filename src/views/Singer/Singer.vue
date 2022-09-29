<template>
  <div class="singer">
    <!-- <list-view @select="selectSinger" :data="singers"></list-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { reqGetSingerList } from "@/network/api";

export default {
  name: "Singer",
  created() {
    this.getSingerList();
  },
  methods: {
    // 获取请求歌手数据
    async getSingerList() {
      let result = await reqGetSingerList();
      console.log(result);
      if(result.code ==200){
        
      }
    },

    // 歌手列表
    singers() {},
    //点进进入歌手详情
    selectSinger() {},
  },
};
</script>
<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
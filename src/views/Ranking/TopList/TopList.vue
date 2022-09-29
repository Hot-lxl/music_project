<template>
  <transition name="slide">
    <MusicList :title="title" :bg-image="bgImage" :songs="songs"> </MusicList>
  </transition>
</template>

<script>
import { createRankMusic } from "@/common/song";
import MusicList from "@/components/MusicList/MusicList";
import { mapGetters, mapState } from "vuex";
export default {
  name: "TopList",
  components: {
    MusicList,
  },
  data() {
    return {
      songTopList: [], // 整理好的排行歌曲
    };
  },
  created() {
    // 判断是否有id
    if (!this.topList.id) {
      this.$router.push("/ranking");
      return;
    }
    // 页面创建前把数据整理好
    this._createRankMusic(this.topList.tracks);
  },
  computed: {
    // 排行详情数据
    ...mapGetters(["topList"]),
    // 标题
    title() {
      return this.topList.name;
    },
    // 标题图片
    bgImage() {
      return this.topList.coverImgUrl;
    },
    // 歌曲
    songs() {
      return this.songTopList;
    },
  },
  methods: {
    // 对得到的歌单数据进行处理
    _createRankMusic(list) {
      //空数组
      let ret = [];
      list.forEach((item) => {
        // 循环遍历把每首歌装入空对象
        ret.push(createRankMusic(item));
      });
      // 把数据赋值给songToList
      this.songTopList = ret;
    },
  },
};
</script>
<style lang="stylus" scoped >
.slide-enter-active, .slide.leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>
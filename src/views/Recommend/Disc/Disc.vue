<template>
  <transition name="slide">
    <MusicList :title="title" :bg-image="bgImage" :songs="songs"> </MusicList>
  </transition>
</template>

<script>
import { createRecommendListSong } from "@/common/song";
import { reqSongDetail } from "@/network/api";
import { mapState } from "vuex";
import MusicList from "@/components/MusicList/MusicList.vue";
export default {
  name: "Disc",
  data() {
    return {
      // 歌单详情数据
      songs: [],
    };
  },
  components: {
    MusicList,
  },
  created() {
    this.getSongDetail(this.disc.id);
  },
  computed: {
    ...mapState({
      // 获取歌单详情
      disc: "Disc",
    }),
    // 计算出标题
    title() {
      return this.disc.name;
    },
    // 点击的背景图片
    bgImage() {
      return this.disc.picUrl;
    },
  },
  methods: {
    // 通过路由的 歌单id 获取歌单歌曲数据
    async getSongDetail(id) {
      // 判断是否存在id
      if (!this.disc.id) {
        this.$router.push("/recommend");
        return;
      }
      // 存在就发送ajax请求数据
      const result = await reqSongDetail(id);
      if (result.code == 200) {
        this.songs = result.playlist.tracks.map((item) => {
          // 使用构造函数来装每一个歌单的数据提取指定的属性
          return createRecommendListSong(item);
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped >
// enter-active 和 leave-active 分别代表进场和出场 Vue 会自动识别
.slide-enter-active, .slide.leave-active {
  transition: all 0.3s;
}
// 开始到结束
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

</style>
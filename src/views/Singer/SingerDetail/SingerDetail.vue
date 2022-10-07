<template>
  <transition name="silde">
    <MusicList :title="title" :bgImage="bgImage" :songs="songs" />
  </transition>
</template>

<script>
import { createSong } from "@/common/song";
import { resGetSingerDetail } from "@/network/api";
import MusicList from "@/components/MusicList/MusicList";
import { mapGetters } from "vuex";
export default {
  name: "SingerDetail",
  data() {
    return {
      songs: [], //歌曲数据
    };
  },
  components: {
    MusicList,
  },
  computed: {
    // 点击的歌手
    ...mapGetters(["singer"]),
    // 计算歌手name
    title() {
      return this.singer.name;
    },
    // 歌手图片
    bgImage() {
      return this.singer.avatar;
    },
  },
  created() {
    // 判断是否有id
    if (!this.singer.id) {
      this.$router.push("/singer");
      return;
    }
    this._getDetail(this.singer.id);
  },
  methods: {
    // 获取歌手单曲
    async _getDetail(id) {
      let result = await resGetSingerDetail(id);
      if (result.code === 200) {
        // 对歌曲进行处理
        this.songs = this._normalizeSongs(result.hotSongs);
      }
    },
    _normalizeSongs(list) {
      let songs = [];
      // 遍历所有歌曲
      list.map((item) => {
        songs.push(createSong(item));
      });
      return songs;
    },
  },
};
</script>

<style lang="stylus" scoped>
.silde-enter-active, .silde-leave-active {
  transform: all 0.3s;
}

.silde-enter, .silde-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>
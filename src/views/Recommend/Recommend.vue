<template>
  <!-- 推荐页面首页 -->
  <div>
    <div>
      <!-- 轮播组件 -->
      <Carousel :swiper="carousel"></Carousel>
      <div>
        <!-- 推荐歌单 -->
        <div class="songlist" v-show="SongList.length">
          <div class="song-title">
            <h1 class="title">推荐歌单</h1>
          </div>

          <ul class="song-list">
            <li
              class="song-item"
              v-for="item in SongList"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="item-icon">
                <img class="icon" :src="item.picUrl" alt="" />
              </div>
              <div class="item-count">
                <i class="iconfont icon">&#xe601;</i>
                <i class="conunt">
                  {{ item.playCount.toFixed().slice(0, 4) }}万
                </i>
              </div>
              <div class="song-text">
                <p class="text">{{ item.name }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- 推荐音乐 -->
        <div class="songlist" v-show="MusicList.length">
          <div class="song-title">
            <h1 class="title">推荐新音乐</h1>
          </div>

          <ul class="song-list">
            <li
              class="song-item"
              v-for="(item, index) in MusicList"
              :key="item.id"
              @click="playNewMusic(item, MusicList, index)"
            >
              <div class="item-icon">
                <img class="icon" :src="item.picUrl" alt="" />
              </div>
              <div class="song-text">
                <p class="text">{{ item.name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading部分 -->
      <div class="loading" v-show="!(SongList.length && MusicList.length)">
        <Loading></Loading>
      </div>
    </div>
    <!-- 子组件出口 -->
    <router-view />
  </div>
</template>

<script>
import Loading from "@/components/Base/Loading";
import { mapState } from "vuex";
import Carousel from "@/components/Carousel/Carousel.vue";
export default {
  name: "Recommend",
  data() {
    return {
      // 轮播数据的-手机
      type: 2,
    };
  },
  components: {
    Carousel,
    Loading,
  },
  mounted() {
    // 获取轮播图数据函数
    this.$store.dispatch("GetCarousel", this.type);
    // 获取推荐歌单数据
    this.$store.dispatch("GetSongList");
    // 获取推荐音乐数据
    this.$store.dispatch("GetMusicList", this.type);
  },
  computed: {
    ...mapState({
      // 轮播图
      carousel: "carousel",
      // 歌单
      SongList: "SongList",
      // 音乐
      MusicList: "MusicList",
    }),
  },
  methods: {
    // 点击进入歌单详情页面
    selectItem(item) {
      this.$router.push({ path: `/recommend/${item.id}` });
      // 把点击的歌单用vuex存储
      this.$store.commit("SETDISC", item);
    },
  },
};
</script>

<style lang="stylus" scoped>
.songlist {
  overflow: hidden;
  width: 100%;

  .song-title {
    height: 65px;
    line-height: 65px;
    background: #FFFAF0;

    .title {
      font-size: 15px;
      font-weight: 600;
      color: #CD853F;
      padding-left: 8px;
    }
  }

  .song-list {
    display: flex;
    // 规定灵活的项目在必要的时候拆行或拆列。
    flex-wrap: wrap;
    padding: 4px 0;
    background: #FFFAF0;

    .song-item {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      width: 33.3%;
      padding: 0 1%;

      .icon {
        max-width: 100%;
        border-radius: 4px;
      }

      .item-count {
        position: absolute;
        display: inline-block;
        color: #f1f1f1;
        right: 6px;
        top: 5px;

        .icon, .conunt {
          font-size: 12px;
        }
      }

      .song-text {
        height: 50px;
        line-height: 48px;

        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 700;
        }
      }
    }
  }
}

.loading {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
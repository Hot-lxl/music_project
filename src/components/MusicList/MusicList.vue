<template>
  <!-- 推荐歌曲页面 -->
  <div class="music-list">
    <div class="back">
      <i @click="back" class="iconfont icon-back">&#xe653;</i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" :style="bgStyle">
      <div class="filter"></div>
    </div>
    <!-- 插槽来放歌单列表和加载图 -->
    <Scroll :data="songs" class="content" ref="list">
      <div class="song-list-wrapper">
        <!-- 自定义事件 -->
        <SongList @select="selectItem" :songs="songs"></SongList>
      </div>
      <!-- 加载提示图 -->
      <div class="loading-container" v-show="!songs.length">
        <Loading></Loading>
      </div>
      
      <!-- 找不到音乐提示框组件 -->
      <transition
        enter-active-class="bounceInLeft"
        leave-active-class="fadeOutUp"
      >
        <div class="prompt-container animated" v-show="prompt">
          <Prompt></Prompt>
        </div>
      </transition>
    </Scroll>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Prompt from "@/components/Base/prompt";
import { reqSongUrl } from "@/network/api";
import SongList from "@/components/SongList/SongList";
import Scroll from "@/components/Base/scroll";
import Loading from "@/components/Base/Loading";
export default {
  name: "MusicList",
  props: {
    title: String,
    bgImage: String,
    songs: Array,
  },
  data() {
    return {
      // 歌曲播放地址
      url: "",
      // 是否显示提示框
      prompt: false,
    };
  },
  components: {
    SongList,
    Scroll,
    Loading,
    Prompt,
  },
  created() {
    //决定如何滚动
    this.probeType = 3;
    // 开启监听滚动轴的变化
    this.listenScroll = true;
  },
  computed: {
    // 路由点击的背景图片
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    },
  },
  methods: {
    // 回到上一页
    back() {
      this.$router.push("/recommend");
    },
    //点击播放音乐(发送自定义事件)
    async selectItem(item, index) {
      // 根据点击的歌曲id获取音乐url
      const result = await reqSongUrl(item.id);
      if (result.code == 200) {
        // 获取url地址判断是否存在
        if (result.data[0].url === null) {
          // 找不到地址就显示提示框
          this.prompt = true;
          this.OutPrompt();
          return;
        }
        // 如果有地址就把地址存入vuex
        const url = result.data[0].url;
        this.$store.dispatch("selectPlay", { list:this.songs, index, url });
      }
    },
    // 1.8秒后关闭提示框
    OutPrompt() {
      var timer = setTimeout(() => {
        this.prompt = false;
        // 关闭定时器
        clearTimeout(timer);
      }, 1800);
    },
  },
};
</script>

<style lang="stylus" scoped>
.music-list {
  position: fixed;
  z-index: 100;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fffaf0;

  .back {
    position: absolute;
    top: 0px;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: 16px;
      color: #ffffff;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: 17px;
    color: #ccc;
    font-weight: 700;
    letter-spacing: 3px;
  }

  .bg-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 60%;
    transform-origin: top;
    background-size: cover;

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .song-list-wrapper {
      // 解决显示不全的问题
      padding-bottom: 220px;
    }

    .loading-container {
      position: absolute;
      width: 100px;
      height: 47px;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      padding-bottom: 100%;
    }

    .prompt-container {
      position: absolute;
      width: 100%;
      height: 30px;
      background: #2f3542;
      top: 0;
      opacity: 0.8;
    }
  }
}
</style>
<template>
  <!-- 搜索建议页面 -->
  <Scroll
    class="suggest"
    :data="songs"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
    @scrollToEnd="searchMore"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in songs"
        :key="index"
        @click="selectItem(item)"
      >
        <div class="name">
          <p class="text">{{ item.name }} — {{ item.singer }}</p>
        </div>
      </li>
    </ul>

    <Loading v-show="hasMore"></Loading>

    <transition
      enter-active-class="bounceInLeft"
      leave-active-class="fadeOutUp"
      :duration="{ enter: 500, leave: 800 }"
    > 
      <!-- 音乐提示框 -->
      <div class="prompt-container animated" v-show="prompt">
        <Prompt></Prompt>
      </div>
    </transition>

    <div v-show="!hasMore && !songs.length" class="no-result-wrapper">
      抱歉，未搜索出结果
    </div>
  </Scroll>
</template>

<script>
import Prompt from "@/components/Base/prompt";
import { createSearchSong } from "@/common/song";
import Loading from "@/components/Base/Loading";
import Scroll from "@/components/Base/scroll";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "Suggest",
  components: {
    Loading,
    Scroll,
    Prompt,
  },
  data() {
    return {
      page: 0, // 偏移数量,记录多少条数据
      songs: [], //歌曲数据
      pullup: true, // 上拉刷新 启动
      beforeScroll: true, //滚动开始的事件
      hasMore: true, //是否显示更多
      prompt: false, //提示框
    };
  },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  watch: {
    // 监听query的变化
    query(val) {
      if (val == "") {
        //初始化数据
        this.songs = [];
        this.page = 0;
        this.hasMore = false;
        // 退出
        return;
      } else {
        this.songs = [];
        this.page = 0;
        this.hasMore = true;
        // 调用方法进行搜索
        this.Search();
      }
    },
  },
  methods: {
    ...mapActions(["insertSong"]),
    ...mapMutations({
      setCurrentUrl: "SET_CURRENT_URL",
    }),
    // 搜索
    async Search() {
      this.hasMore = true;
      //需要定义滚动初始位置
      this.$refs.suggest.scrollTo(0, 0);
      // 发送ajax请求数据
      let result = await this.$API.reqSearchSongs(this.query, this.page);
      if (result.code == 200) {
        // 先获取得到的数据
        let songs = result.result.songs;
        //定义个空数组
        let ret = [];
        // 遍历取出数据
        songs.forEach((item) => {
          // 处理得到的数据
          ret.push(createSearchSong(item));
        });
        // 赋值给songs
        this.songs = ret;
      }
      // 每次请求就+30
      this.page += 30;
    },

    //开始滚动了就调用search组件的blurInput()
    listScroll() {
      console.log("滚动");
      this.$emit("listScroll");
    },
    // 上拉 加载更多
    async searchMore() {
      console.log("上拉进入了");
      // 判断是否加载更多
      if (!this.hasMore) {
        return;
      }
      // 发送请求获取全部
      let result = await this.$API.reqSearchSongs(this.query, this.page);
      if (result.code === 200) {
        let songs = result.result.songs;
        // 判断是否有数据
        if (!songs) {
          // 不在加载更多
          this.hasMore = false;
          return;
        }
        let ret = [];
        songs.forEach((item) => {
          ret.push(createSearchSong(item));
        });
        //把数据合并
        this.songs = this.songs.concat(ret);
        this.page += 30;
      }
    },
    // 点击播放歌曲
    async selectItem(item) {
      console.log("播放歌曲");
      // 先根据id获取url
      let res = await this.$API.reqSongUrl(item.id);
      if (res.code == 200) {
        let url = res.data[0].url;
        // 判断地址是否为空
        if (url === null) {
          // 提示框显示
          this.prompt = true;
          this.OutPrompt(); //关闭提示
          return; //退出
        }
        // 有地址再根据歌单详情获取歌曲信息主要是图片
        let resDetail = await this.$API.reqSongDetail(item.id);
        item.image = resDetail.songs[0].al.picUrl;
        // 点击的歌曲添加到vuex
        this.insertSong(item);
        // 将url添加到vuex
        this.setCurrentUrl(url);
      }
      //发送自定义事件保存点击的搜索历史
      // this.$emit("select");
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
@import '~@/assets/stylus/variable';
@import '~@/assets/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
  background: #fffaf0;
  padding-top: 20px;

  .suggest-list {
    padding: 0 30px 0 0;
    border: 1px solid #e4e4e4;
    width: 100%;

    .suggest-item {
      display: flex;
      width: 100%;
      height: 50px;
      align-items: center;
      padding: 3px 10px;
      border-bottom: 1px solid #e4e4e4;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: #2e3030;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .prompt-container {
    position: absolute;
    top: -10px;
    left: 28%;
    color: #000 !important;
    padding: 8px 20px;
    background: #bdc3c7;
    border-radius: 2px;
  }

  .no-result-wrapper {
    position: fixed;
    left: 50%;
    top: 40vh;
    transform: translatex(-50%);
    color: #000;
    font-size: 16px;
  }
}
</style>
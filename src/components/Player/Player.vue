<template>
  <div class="player" v-show="playlist.length > 0">
    <!-- 播放器展开图 -->
    <transition name="normal">
      <!--  //如果全屏 -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="fa fa-chevron-left"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="rotateCd">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>

            <!-- 提示框组件 -->
            <transition
              enter-active-class="bounceInLeft"
              leave-active-class="fadeOutUp"
              :duration="{ enter: 500, leave: 800 }"
            >
              <div class="prompt-container animated" v-show="ControlPrompta">
                <Prompt></Prompt>
              </div>
            </transition>

            <div class="middle-r">
              <div class="cd-gc">暂无歌词</div>
            </div>
          </div>
        </div>
        <!-- 下面播放按钮 -->
        <div class="bottom">
          <div class="progress-wrapper">
            <!--currentTime： 歌曲当前时间 -->
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条 -->
              <ProgressBar
                :precent="precent"
                @percentChange="percentChange"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{ format(duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i v-html="iconMode" class="iconfont" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="prev" class="fa fa-angle-double-left"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" class="fa" :class="playIcon"></i>
            </div>
            <div class="icon i-right">
              <i @click="next" class="fa fa-angle-double-right"></i>
            </div>
            <div class="icon i-right">
              <i class="fa fa-heartbeat"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 下栏播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img
            :class="rotateCd"
            :src="currentSong.image"
            width="40"
            height="40"
          />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <i class="fa" :class="miniIcon"></i>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="fa fa-random"></i>
        </div>
      </div>
    </transition>

    <play-list ref="playlist"></play-list>

    <!-- 使用audio标签来播放音乐 -->
    <audio
      :src="currentUrl"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updataTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import PlayList from "@/components/PlayList/PlayList";
import { random } from "@/common/util";
import { reqSongUrl } from "@/network/api";
import { playMode } from "@/common/config";
import ProgressBar from "@/components/Base/Progressbar";
import Prompt from "@/components/Base/prompt";
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      songReady: false, //歌曲是否准备就绪
      currentTime: 0, //播放的当前时间
      duration: 0, //歌曲播放的总时长
      ControlPrompta: false, // 控制弹出框显示
      // 字体图标iconfont
      sequence: "&#xe671;",
      loop: "&#xe607;",
      random: "&#xe672;",
    };
  },
  components: {
    Prompt,
    ProgressBar,
    PlayList,
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "currentUrl",
      "mode",
      "playing",
      "currentIndex",
      "sequenceList",
    ]),
    // 计算百分比
    precent() {
      // 歌曲播放的时间 / 总时间的 百分比
      return this.currentTime / this.duration;
    },
    // 播放模式的图标
    iconMode() {
      //如果是顺序播放
      return this.mode === playMode.sequence
        ? this.sequence
        : this.mode === playMode.loop
        ? this.loop
        : this.random;
    },

    playIcon() {
      // playing 为 ture时 显示暂停的图标 false时 显示播放的图标
      return this.playing ? "fa-pause-circle-o" : "fa-play-circle";
    },
    // 歌曲cd磁盘图片 旋转 类名 true 旋转 false 停止
    rotateCd() {
      return this.playing ? "play" : "play pause";
    },
    miniIcon() {
      // playing 为 ture时 显示暂停的图标 false时 显示播放的图标
      return this.playing ? "fa-pause-circle-o" : "fa-play-circle";
    },
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlaying: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setCurrentUrl: "SET_CURRENT_URL",
      setPlayMode: "SET_PLAY_MODE",
      setplaylist: "SET_PLAYLIST",
    }),
    // 发送url请求 获取url地址 再改变vuex 的 setCurrentUrl值
    async getUrl(id) {
      // 根据歌曲id获取地址
      const result = await reqSongUrl(id);
      if (result.code === 200) {
        // 地址为null
        if (result.data[0].url == null) {
          // 提示框显示
          this.ControlPrompta = true;
          // 1s后提示弹出框消失
          this.OutPrompt();
          // 停止播放上一首歌曲
          this.$refs.audio.pause();
          //可以点击上一首或者下一首歌曲
          this.songReady = true;
        }
        // 成功则使用mutaions的setCurrentUrl改变state中的地址
        this.setCurrentUrl(result.data[0].url);
      }
    },
    // 1秒后关闭提示框
    OutPrompt() {
      var timer = setTimeout(() => {
        this.ControlPrompta = false;
        // 关闭定时器
        clearTimeout(timer);
      }, 1000);
    },
    // 点击隐藏展开播放页面
    back() {
      this.setFullScreen(false);
    },
    // 点击切换播放顺序
    changeMode() {
      // 三种状态可以切换计算出来
      let mode = (this.mode + 1) % 3;
      // 修改mode值state
      this.setPlayMode(mode);
      // 创建一个空的list来装顺序列表
      let list = null;
      // console.log(this.sequenceList + "---");
      // 顺序播放
      if (mode === playMode.sequence) {
        list = this.sequenceList;
      } else if (mode === playMode.random) {
        // 随机 打乱顺序列表就行了
        list = random(this.sequenceList);
      } else if (mode === playMode.loop) {
        // 循环 必须设置防止传入空对象而报错
        list = this.sequenceList;
      }
      // 如果是循环那么就根据列表id和当前播放的id找到对应的歌曲下标
      this.resetCurrentIndex(list);
      // 修改顺序列表
      this.setplaylist(list);
    },
    resetCurrentIndex(list) {
      console.log(list);
      // 根据列表查找当前播放的id找到了就返回下标
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      // 重新设置索引
      this.setCurrentIndex(index);
    },
    // audio标签的时间
    percentChange(precent) {
      // 播放的歌曲time = 歌曲总时间 * (百分比)
      this.$refs.audio.currentTime = this.$refs.audio.duration * precent;
      // 是否播放改变暂停按钮状态
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    // 上一首歌
    prev() {
      // 首先判断歌曲是否准备好
      if (!this.songReady) {
        return;
      }
      // 当前索引-1
      let index = this.currentIndex - 1;
      // 判断如果为-1那么就是最后一首歌
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      // 歌曲只有一首的情况下
      if (this.playlist.length === 1) {
        this.aloop();
        return;
      }
      //改变索引的值
      this.setCurrentIndex(index);
      // 根据当前索引 获取 id值 再发送请求获取 歌曲url值 再修改 vuex中的 currentUrl
      this.getUrl(this.playlist[index].id);
      // 改变播放的状态
      if (!this.playing) {
        this.togglePlaying();
      }
      // 关闭当前歌曲准备
      this.songReady = false;
    },
    // 歌曲只有一首的情况下
    aloop() {
      // 时间为0
      this.$refs.audio.currentTime = 0;
      // 播放
      this.$refs.audio.play();
    },
    // 暂停开始按钮
    togglePlaying() {
      this.setPlaying(!this.playing);
    },
    // 下一首歌
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index > this.playlist.length - 1) {
        index = 0;
      }
      this.setCurrentIndex(index);
      this.getUrl(this.playlist[index].id);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    //处理歌曲的时间
    format(int) {
      // 初始化
      int = int | 0;
      // 分钟
      const minute = (int / 60) | 0;
      // 秒
      const second = this.pad(int % 60);
      return `${minute}:${second}`;
    },
    // 补零操作
    pad(num, m = 2) {
      // 转成string计算length
      let length = num.toString().length;
      // 循环对比如果length小于2那么前面就加个0--06、07秒
      while (length < m) {
        num = "0" + num;
        length++;
      }
      return num;
    },
    ready() {
      // 歌曲准备好后 就播放 解决点击上/下一首按钮后 不播放的问题
      this.songReady = true;
      // 播放音乐调用audio标签的 play()方法
      this.$refs.audio.play();
      // 获取歌曲的总时长
      this.duration = this.$refs.audio.duration;
    },
    //  error 事件，当歌曲发生错误的时候，做用户体验，防止用户快速切换导致报错。
    error() {
      this.songReady = true;
    },
    //修改当前播放的时间
    updataTime(event) {
      // e.target.currentTime 获取的是歌曲正在播放的时间 一直播放则一直获取
      this.currentTime = event.target.currentTime;
    },
    // 歌曲播放完成
    end() {
      // 判断播放的模式是否是循环
      if (this.mode === playMode.loop) {
        // 单曲循环情况下就重新变为0
        setTimeout(() => {
          this.$refs.audio.currentTime = 0;
        }, 1000);
      } else {
        // 否则下一首
        this.next();
      }
    },

    // 播放器展开
    open() {
      this.setFullScreen(true);
    },
    // 展开播放列表(调用子组件的方法)
    showPlaylist() {
      this.$refs.playlist.show();
    },
  },
  watch: {
    // 监听 播放状态 true 播放  false 暂停
    playing(NewPlaying) {
      // 获取audiob标签
      const audio = this.$refs.audio;
      // 判断是否为true播放
      this.$nextTick(() => {
        NewPlaying ? audio.play() : audio.pause();
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/mixin.styl';
@import '~@/assets/stylus/variable.styl';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #535c68;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .fa-chevron-left {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: #e84118;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: #f1f2f6;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .prompt-container {
          width: 100%;
          height: 30px;
          background: #a4b0be;
          opacity: 0.8;
        }

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: #fff;
          font-size: 15px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
            margin-right: 10px;
          }

          &.time-r {
            text-align: right;
            margin-left: 10px;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: #e84118;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .fa {
        font-size: 30px;
        color: #4834d4;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
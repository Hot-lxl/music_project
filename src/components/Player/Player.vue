<template>
  <div class="player" v-show="playlist.length > 0">
    <!-- 播放器展开图 -->
    <transition name="normal">
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
              <div class="cd">
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
              <!-- <i v-html="iconMode" class="iconfont" @click="changeMode"></i> -->
            </div>
            <div class="icon i-left">
              <i @click="prev" class="fa fa-angle-double-left"></i>
            </div>
            <div class="icon i-center">
              <!-- <i @click="togglePlaying" class="fa" :class="playIcon"></i> -->
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
    <!-- <transition name="mini">
      <div
        class="mini-player"
        v-show="!fullScreen"
        @click="open"
      >
        <div class="icon">
          <img
            :class="rotateCd"
            v-lazy="currentSong.image"
            width="40"
            height="40"
          >
        </div>
        <div class="text">
          <h2
            class="name"
            v-html="currentSong.name"
          ></h2>
          <p
            class="desc"
            v-html="currentSong.singer"
          ></p>
        </div>
        <div
          class="control"
          @click.stop="togglePlaying"
        >
          <i
            class="fa"
            :class="miniIcon"
          ></i>
        </div>
        <div
          class="control"
          @click="showPlaylist"
        >
          <i class="fa fa-random"></i>
        </div>
      </div>
    </transition> -->

    <!-- <play-list ref="playlist"></play-list> -->

    <!-- <audio
      :src="currentUrl"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updataTime"
      @ended="end"
    ></audio> -->
  </div>
</template>

<script>
import ProgressBar from "@/components/Base/Progressbar";
import Prompt from "@/components/Base/prompt";
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      currentTime: 0, //播放的当前时间
      duration: 0, //歌曲播放的总时长
      // 控制弹出框显示
      ControlPrompta: false,
    };
  },
  components: {
    Prompt,
    ProgressBar
  },
  computed: {
    ...mapGetters(["fullScreen", "playlist", "currentSong"]),
    // 歌曲播放的时间 和 总时间的 百分比
    precent() {},
  },
  methods: {
    ...mapMutations({ setFullScreen: "SET_PLAYING_STATE" }),

    // 点击隐藏展开播放页面
    back() {
      this.setFullScreen(false);
    },

    // 百分比条
    percentChange() {},
    // 上一首歌
    prev() {},
    // 暂停开始按钮
    togglePlaying() {},
    // 下一首歌
    next() {},
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
            margin-right: 2px;
          }

          &.time-r {
            text-align: right;
            margin-left: 2px;
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
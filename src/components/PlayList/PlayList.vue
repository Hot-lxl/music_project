<template>
  <transition
    leave-active-class="fadeOutDown"
    enter-active-class="fadeInUp"
    :duration="{ enter: 200, leave: 100 }"
  >
    <div class="playlist animated" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">全部歌曲</span>
            <span class="clear" @click="showConfirm"
              ><i class="fa fa-trash"></i
            ></span>
          </h1>
        </div>
        <Scroll ref="listContent" :data="sequenceList" class="list-content">
          <transition-group name="list" tag="ul">
            <li
              class="item"
              ref="listItem"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
            >
              <i class="current fa" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like">
                <i class="fa fa-heart-o"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="fa fa-times"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <!-- 提示框 -->
      <Confirm
        ref="confirm"
        text="是否清空播放列表歌曲"
        confirBtnText="清空"
        @confirm="confirmClear"
      ></Confirm>
    </div>
  </transition>
</template>

<script>
import { playMode } from "@/common/config";
import Scroll from "@/components/Base/scroll";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Confirm from "@/components/Base/confirm";
export default {
  data() {
    return {
      // 是否显示该组件
      showFlag: false,
    };
  },
  components: {
    Confirm,
    Scroll,
  },
  computed: {
    ...mapGetters(["sequenceList", "mode", "playlist", "currentSong"]),
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING_STATE",
    }),
    ...mapActions(["deleteSong", "deleteSongList"]),
    // 显示歌曲列表
    show() {
      this.showFlag = true;
      setTimeout(() => {
        // 一上来就刷新滚动防止滑动不了的问题
        this.$refs.listContent.refresh();
        // 显示列表跳转到当前歌曲
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    // 点击关闭组件
    hide() {
      this.showFlag = false;
    },
    // 点击删除显示提示框
    showConfirm() {
      this.$refs.confirm.show();
    },
    //清除歌曲列表
    confirmClear() {
      console.log("ok");
      // 发送actions请求清空数据
      this.deleteSongList();
      this.hide();
    },

    // 点击播放音乐
    selectItem(song, index) {
      console.log(song, index);
      // 首先需要判断是否是随机播放
      if (this.mode === playMode.random) {
        // 根据歌曲id找到播放的下标
        let index = this.playList.findIndex((item) => {
          return (item.id = song.id);
        });
      }
      // 重新设置下标
      this.setCurrentIndex(index);
      // 播放
      this.setPlayingState(true);
      // 调用父组件的 getUrl 事件 当点击 另外一首歌时 去请求它的URL 并且改变Vuex 的 CurrentUrl
      this.$parent.getUrl(song.id);
    },
    // 点击歌曲改变class Icon
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "fa-play-circle-o";
      } else {
        return "";
      }
    },
    // 点击删除歌曲
    deleteOne(item) {
      // 判断是否为一首歌曲然后隐藏
      if (this.playlist.length === 1) {
        this.hide();
      }
      // 删除歌曲
      this.deleteSong(item);
    },
    // 歌曲滚动到指定位置
    scrollToCurrent(current) {
      // 找到当前点击的歌曲和顺序列表的位置
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      // 调用Scroll组件的方法滚动到指定位置
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
  },
  watch: {
    // 监听歌曲的改变然后展开列表进行显示
    currentSong(NewSong, oldSong) {
      // 点击相同的歌曲或者已经显示播放列表了
      if (!this.showFlag || NewSong.id === oldSong.id) {
        return;
      }
      // 滚动列表到指定的歌曲
      this.scrollToCurrent(NewSong);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/variable';
@import '~@/assets/stylus/mixin';

.playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          extend-click();

          .fa-trash {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: #f1c40f;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 20px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
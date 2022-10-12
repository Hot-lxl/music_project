<template>
  <Scroll
    ref="listview"
    class="listview"
    :data="data"
    :listenScroll="listenScroll"
  >
    <!-- 歌手列表 -->
    <ul>
      <li
        ref="listGroup"
        class="list-group"
        v-for="group in data"
        :key="group.id"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            @click="selectItem(item)"
            class="list-group-item"
            v-for="item in group.items"
            :key="item.id"
          >
            <img class="avatar" :src="item.avatar" alt="" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母列表 -->
    <div
      class="list-shotrcut"
      @touchstart="OnTouchStart"
      @touchmove.stop.prevent="OnTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "./scroll";
const ShortHeight = 16.8;
export default {
  name: "ListView",
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    Scroll,
  },
  created() {
    // 存放有关 触摸事件的数据
    this.touch = {};
    // 开启监听滚动轴的变化
    this.listenScroll = true;
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
    };
  },
  computed: {
    // 把所有的歌手title截取第一个字
    shortcutList() {
      return this.data.map((item) => {
        return item.title.substr(0, 1);
      });
    },
  },
  methods: {
    // 点击文字歌手跳转到对应的位置
    OnTouchStart(e) {
      // 获取 data-index 属性的值
      let anchorIndex = this.getData(e.target, "index");
      let firstTouch = e.touches[0];
      // 获取pageY轴的位置
      this.touch.y1 = firstTouch.pageY;
      // 把点击的字母索引添加到touch
      this.touch.anchorIndex = anchorIndex;
      // 改变歌手列表的位置
      this._scrollTo(anchorIndex);
    },
    // 触摸移动字母改变歌手列表位置
    OnTouchMove(e) {
      let firshTouch = e.touches[0];
      this.touch.y2 = firshTouch.pageY;
      // 计算触摸的位置--| 0表示的意思则是取整。
      // let delta = ((this.touch.y2 - this.touch.y1) / ShortHeight) | 0;
      // Math.round()四舍五入也可以
      let delta = Math.round((this.touch.y2 - this.touch.y1) / ShortHeight);
      // 刚才的位置加上触摸结束的位置=现在的位置
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      // 改变歌手列表的位置
      this._scrollTo(anchorIndex);
    },
    // 歌手列表跳转到指定位置
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    // 获取当前index
    getData(el, name, val) {
      const prefix = "data-";
      name = prefix + name;
      if (val) {
        // 如果有val 设置这个属性到dom中
        return el.setAttribute(name, val);
      } else {
        // 如果没有val这个参数 就是获取
        return el.getAttribute(name);
      }
    },
    selectItem(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="stylus" scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #F2F3F4;

  .list-group {
    padding: 1px 0 0 1px;

    .list-group-title {
      height: 24px;
      line-height: 24px;
      padding-left: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      font-size: 16px;
      color: #FF8C00;
      background: #fff;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      margin: 0 5px;
      border-bottom: 1px solid rgb(228, 228, 228);

      &:last-child {
        border: none;
        margin-bottom: 10px;
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 3px;
      }

      .name {
        margin-left: 20px;
        color: $color-text;
        font-size: 14px;
      }
    }
  }

  .list-shotrcut {
    position: absolute;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    text-align: center;
    padding: 200px 0;
    font-family: Verdana, Geneva, sans-serif;

    .item {
      padding: 2px 4px;
      color: #757575;
      font-size: 13px;
      font-weight: bold;

      &.current {
        color: red;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 20px;
      line-height: 20px;
      padding-left: 20px;
      font-size: 12px;
      color: #ccc;
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
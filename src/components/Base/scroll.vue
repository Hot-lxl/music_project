<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    /*1 滚动的时候会派发scroll事件，会截流。
      2 滚动的时候实时派发scroll事件，不会截流。
      3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件     */
    probeType: {
      type: Number,
      default: 1,
    },
    //  点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true,
    },
    //  列表的数据
    data: {
      type: Array,
      default: null,
    },
    //  是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false,
    },
    /** * 是否派发滚动到底部的事件，用于上拉加载 */
    pullup: {
      type: Boolean,
      default: false,
    },
    /** * 当数据更新后，刷新scroll的延时。 */
    refreshDelay: {
      type: Number,
      default: 20,
    },

    /** * 是否派发列表滚动开始的事件 */
    beforeScroll: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // 创建Bscroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        // 手指滑动
        probeType: this.probeType,
        // 点击
        click: this.click,
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        let _this = this;
        // 监视滑动过程
        this.scroll.on("scroll", (pos) => {
          _this.$emit("scroll", pos);
        });
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd");
          }
        });
      }
      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    enable() {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.disable();
    },
    refresh() {
      // 代理better-scroll的refresh方法
      //  作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // 作用：相对于当前位置偏移滚动 x,y 的距离
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 作用：滚动到指定的目标元素。
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    },
  },
};
</script>

<style>
</style>
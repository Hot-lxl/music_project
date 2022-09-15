<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
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

      // 判断是否有监视
      if (this.listenScroll) {
        let _this = this;
        // 监视滑动过程
        this.scroll.on("scroll", (pos) => {
          _this.$emit("scroll", pos);
        });
      }
      if (this.pullup) {
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit("scrollToEnd");
          }
        });
      }
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
  },
  watch: {
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